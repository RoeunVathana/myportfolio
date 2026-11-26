"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type Profile = {
  displayName: string;
  role: string;
  intro: string;
  about: string;
  location: string;
  availability: string;
  email: string;
  avatarUrl: string;
};

type SiteInfo = {
  stack: string;
  currently: string;
  location: string;
  contactEmail: string;
  github: string;
  linkedin: string;
};

type Project = {
  id: string;
  title: string;
  tag: string;
  description: string;
  year: string;
  accent: string;
  link: string;
  featured: boolean;
};

type Content = { profile: Profile; siteInfo: SiteInfo; projects: Project[] };
type Tab = "overview" | "profile" | "projects" | "siteInfo";

const dashboardSessionKey = "noah-dashboard-key";

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production"
  ? "https://noah-portfolio-api.vivaciousdandelion4.chatgpt.site"
  : "http://localhost:4000");

const emptyProject: Project = {
  id: "",
  title: "",
  tag: "",
  description: "",
  year: new Date().getFullYear().toString(),
  accent: "project-orbit",
  link: "#",
  featured: true,
};

function Field({ label, value, onChange, multiline = false, type = "text" }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string }) {
  return (
    <label className="cms-field">
      <span>{label}</span>
      {multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} />}
    </label>
  );
}

function ProfileImageField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [error, setError] = useState("");

  function handleFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file.");
      return;
    }
    if (file.size > 1024 * 1024) {
      setError("Please choose an image smaller than 1 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setError("");
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="cms-image-upload cms-field-wide">
      <div className="cms-image-preview">{value ? <img src={value} alt="Profile preview" /> : <span>NO<br />PHOTO</span>}</div>
      <div className="cms-image-controls">
        <span className="cms-field-label">Profile photo</span>
        <label className="cms-file-button"><input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFile} />Choose from folder</label>
        {value && <button className="cms-remove-image" type="button" onClick={() => onChange("")}>Remove photo</button>}
        <p>JPG, PNG, or WebP · 1 MB max · saved with your profile.</p>
        {error && <small className="cms-upload-error">{error}</small>}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [key, setKey] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [draftProject, setDraftProject] = useState<Project>(emptyProject);
  const [tab, setTab] = useState<Tab>("overview");
  const [state, setState] = useState<"locked" | "loading" | "ready" | "error">("locked");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notice, setNotice] = useState("");
  const didMountRef = useRef(false);

  async function loadContent(accessKey = key) {
    const response = await fetch(`${apiUrl}/api/admin/content`, { headers: { "x-dashboard-key": accessKey } });
    if (response.status === 401) throw new Error("invalid-key");
    if (!response.ok) throw new Error("api-error");
    return (await response.json()) as Content;
  }

  useEffect(() => {
    const savedKey = window.sessionStorage.getItem(dashboardSessionKey);
    if (!savedKey) return;

    setKey(savedKey);
    setState("loading");
    loadContent(savedKey)
      .then((data) => {
        setContent(data);
        setState("ready");
      })
      .catch(() => {
        window.sessionStorage.removeItem(dashboardSessionKey);
        setKey("");
        setErrorMessage("Your dashboard session expired. Enter the key again.");
        setState("locked");
      });
  }, []);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }
    if (state === "locked" && !content) window.sessionStorage.removeItem(dashboardSessionKey);
  }, [content, state]);

  async function openEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMessage("");
    try {
      const data = await loadContent();
      window.sessionStorage.setItem(dashboardSessionKey, key);
      setContent(data);
      setState("ready");
    } catch (error) {
      const remoteLocalApi = typeof window !== "undefined" && window.location.hostname !== "localhost" && apiUrl.includes("localhost");
      setErrorMessage(error instanceof Error && error.message === "invalid-key" ? "That dashboard key is not valid." : remoteLocalApi ? "The remote API is not configured for this build." : "The API is offline. Start with npm run dev and try again.");
      setState("error");
    }
  }

  async function save(path: string, method: "PUT" | "POST", body: unknown, successMessage: string) {
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch(`${apiUrl}${path}`, { method, headers: { "Content-Type": "application/json", "x-dashboard-key": key }, body: JSON.stringify(body) });
      if (!response.ok) throw new Error("save-failed");
      setContent(await loadContent());
      setNotice(successMessage);
    } catch {
      setErrorMessage("Could not save changes. Check that the API is running.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id: string) {
    if (!window.confirm("Delete this project from the portfolio?")) return;
    setSaving(true);
    try {
      const response = await fetch(`${apiUrl}/api/admin/projects/${id}`, { method: "DELETE", headers: { "x-dashboard-key": key } });
      if (!response.ok) throw new Error("delete-failed");
      setContent(await loadContent());
      setDraftProject(emptyProject);
      setNotice("Project deleted from the portfolio.");
    } catch {
      setErrorMessage("Could not delete this project.");
    } finally {
      setSaving(false);
    }
  }

  if (state !== "ready" || !content) {
    return (
      <main className="dashboard-page">
        <nav className="dashboard-nav dashboard-shell" aria-label="Dashboard navigation"><a className="dashboard-brand" href="/">ROEUN VATHANA<span>.</span><small>/ CONTENT STUDIO</small></a><a className="dashboard-back" href="/">Back to portfolio <span>↗</span></a></nav>
        <div className="dashboard-shell">
          <section className="dashboard-hero"><p className="dashboard-kicker"><span /> PRIVATE CONTENT STUDIO / 01</p><h1>Make the site<br /><em>feel like you.</em></h1><p>Edit the profile, projects, and information that power your public portfolio.</p></section>
          <section className="dashboard-lock-card"><div className="lock-orb"><span>↗</span></div><div><p className="dashboard-kicker"><span /> OWNER ACCESS</p><h2>Open the editor.</h2><p>Use your dashboard key to manage the portfolio content stored in PostgreSQL.</p></div><form className="dashboard-login" onSubmit={openEditor}><label htmlFor="dashboard-key">Dashboard key</label><div className="dashboard-key-row"><input id="dashboard-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="••••••••••••" required /><button className="dashboard-button" type="submit" disabled={state === "loading"}>{state === "loading" ? "Opening..." : "Open editor ↗"}</button></div>{state === "error" && <p className="dashboard-error">{errorMessage}</p>}</form></section>
        </div>
      </main>
    );
  }

  const updateProfile = (field: keyof Profile, value: string) => setContent({ ...content, profile: { ...content.profile, [field]: value } });
  const updateSiteInfo = (field: keyof SiteInfo, value: string) => setContent({ ...content, siteInfo: { ...content.siteInfo, [field]: value } });
  const updateProject = (field: keyof Project, value: string | boolean) => setDraftProject({ ...draftProject, [field]: value });

  return (
    <main className="dashboard-page">
      <nav className="dashboard-nav dashboard-shell" aria-label="Dashboard navigation"><a className="dashboard-brand" href="/">ROEUN VATHANA<span>.</span><small>/ CONTENT STUDIO</small></a><div className="cms-nav-actions"><span className="cms-live-dot" /> Saved locally + remotely <a className="dashboard-back" href="/">View portfolio <span>↗</span></a></div></nav>
      <div className="dashboard-shell cms-shell">
        <header className="cms-heading"><div><p className="dashboard-kicker"><span className="green-dot" /> PRIVATE CONTENT STUDIO</p><h1>Make it<br /><em>yours.</em></h1></div><p>Edit your public story, shape the work, and keep the portfolio feeling current.</p></header>
        <div className="cms-layout">
          <aside className="cms-sidebar"><p>Workspace</p>{([ ["overview", "Overview", "01"], ["profile", "Profile", "02"], ["projects", "Projects", "03"], ["siteInfo", "Site info", "04"] ] as const).map(([value, label, number]) => <button className={tab === value ? "active" : ""} key={value} type="button" onClick={() => { setTab(value); setNotice(""); }}><span>{number}</span>{label}</button>)}<div className="cms-sidebar-footer"><span>{content.projects.length.toString().padStart(2, "0")} projects</span><span>{content.profile.displayName}</span></div></aside>
          <section className="cms-content">
            {notice && <div className="cms-notice">✓ {notice}</div>}
            {errorMessage && <div className="cms-error">{errorMessage}</div>}

            {tab === "overview" && <div className="cms-panel overview-panel"><div className="panel-head"><div><p className="dashboard-kicker"><span className="green-dot" /> OVERVIEW</p><h2>Your site at a glance.</h2></div><button className="dashboard-refresh" type="button" onClick={() => { setState("locked"); setContent(null); setKey(""); }}>Lock editor</button></div><div className="cms-overview-grid"><article><span>Profile</span><strong>{content.profile.displayName}</strong><small>{content.profile.role}</small></article><article><span>Published work</span><strong>{content.projects.length.toString().padStart(2, "0")}</strong><small>Projects in your portfolio</small></article><article><span>Stack</span><strong className="overview-stack">{content.siteInfo.stack}</strong><small>{content.siteInfo.currently}</small></article></div><div className="cms-quick-actions"><button type="button" onClick={() => setTab("profile")}>Edit profile <span>↗</span></button><button type="button" onClick={() => { setTab("projects"); setDraftProject(emptyProject); }}>Add a project <span>↗</span></button><button type="button" onClick={() => setTab("siteInfo")}>Update site info <span>↗</span></button></div></div>}

            {tab === "profile" && <div className="cms-panel"><div className="panel-head"><div><p className="dashboard-kicker"><span /> PROFILE</p><h2>Tell people who you are.</h2></div><span className="panel-meta">Public / profile</span></div><div className="cms-form-grid"><Field label="Display name" value={content.profile.displayName} onChange={(value) => updateProfile("displayName", value)} /><Field label="Role / eyebrow" value={content.profile.role} onChange={(value) => updateProfile("role", value)} /><Field label="Email" type="email" value={content.profile.email} onChange={(value) => updateProfile("email", value)} /><Field label="Location" value={content.profile.location} onChange={(value) => updateProfile("location", value)} /><Field label="Availability" value={content.profile.availability} onChange={(value) => updateProfile("availability", value)} /><div className="cms-field-wide"><Field label="Hero introduction" value={content.profile.intro} multiline onChange={(value) => updateProfile("intro", value)} /></div><div className="cms-field-wide"><Field label="About paragraph" value={content.profile.about} multiline onChange={(value) => updateProfile("about", value)} /></div></div><ProfileImageField value={content.profile.avatarUrl} onChange={(value) => updateProfile("avatarUrl", value)} /><div className="cms-actions"><button className="dashboard-button" type="button" disabled={saving} onClick={() => save("/api/admin/profile", "PUT", content.profile, "Profile saved.")}>{saving ? "Saving..." : "Save profile ↗"}</button></div></div>}

            {tab === "siteInfo" && <div className="cms-panel"><div className="panel-head"><div><p className="dashboard-kicker"><span /> SITE INFO</p><h2>Keep the details fresh.</h2></div><span className="panel-meta">Public / details</span></div><div className="cms-form-grid"><Field label="Favorite stack" value={content.siteInfo.stack} onChange={(value) => updateSiteInfo("stack", value)} /><Field label="Currently" value={content.siteInfo.currently} onChange={(value) => updateSiteInfo("currently", value)} /><Field label="Based in" value={content.siteInfo.location} onChange={(value) => updateSiteInfo("location", value)} /><Field label="Contact email" type="email" value={content.siteInfo.contactEmail} onChange={(value) => updateSiteInfo("contactEmail", value)} /><Field label="GitHub URL" value={content.siteInfo.github} onChange={(value) => updateSiteInfo("github", value)} /><Field label="LinkedIn URL" value={content.siteInfo.linkedin} onChange={(value) => updateSiteInfo("linkedin", value)} /></div><div className="cms-actions"><button className="dashboard-button" type="button" disabled={saving} onClick={() => save("/api/admin/site-info", "PUT", content.siteInfo, "Site info saved.")}>{saving ? "Saving..." : "Save site info ↗"}</button></div></div>}

            {tab === "projects" && <div className="cms-panel projects-panel"><div className="panel-head"><div><p className="dashboard-kicker"><span className="green-dot" /> PROJECTS</p><h2>Shape the work.</h2></div><button className="dashboard-button" type="button" onClick={() => setDraftProject(emptyProject)}>＋ New project</button></div><div className="project-editor-layout"><div className="cms-project-list"><p className="cms-list-label">Your projects / {content.projects.length}</p>{content.projects.map((project) => <button className={draftProject.id === project.id ? "selected" : ""} key={project.id} type="button" onClick={() => setDraftProject(project)}><span className={`project-swatch ${project.accent}`} /><span><strong>{project.title}</strong><small>{project.tag}</small></span><b>↗</b></button>)}</div><div className="cms-project-form"><p className="cms-list-label">{draftProject.id ? "Editing project" : "New project"}</p><div className="cms-form-grid"><Field label="Project title" value={draftProject.title} onChange={(value) => updateProject("title", value)} /><Field label="Category / tag" value={draftProject.tag} onChange={(value) => updateProject("tag", value)} /><Field label="Year" value={draftProject.year} onChange={(value) => updateProject("year", value)} /><label className="cms-field"><span>Visual accent</span><select value={draftProject.accent} onChange={(event) => updateProject("accent", event.target.value)}><option value="project-orbit">Lilac / orbit</option><option value="project-mori">Lime / object</option><option value="project-studio">Pink / studio</option></select></label><div className="cms-field cms-field-wide"><Field label="Description" value={draftProject.description} multiline onChange={(value) => updateProject("description", value)} /></div><div className="cms-field cms-field-wide"><Field label="Project URL" value={draftProject.link} onChange={(value) => updateProject("link", value)} /></div></div><label className="cms-check"><input type="checkbox" checked={draftProject.featured} onChange={(event) => updateProject("featured", event.target.checked)} /> Show this project on the homepage</label><div className="cms-actions"><button className="dashboard-button" type="button" disabled={saving || !draftProject.title || !draftProject.description} onClick={() => save(draftProject.id ? `/api/admin/projects/${draftProject.id}` : "/api/admin/projects", draftProject.id ? "PUT" : "POST", draftProject, draftProject.id ? "Project updated." : "Project created.")}>{saving ? "Saving..." : draftProject.id ? "Save project ↗" : "Create project ↗"}</button>{draftProject.id && <button className="cms-delete" type="button" disabled={saving} onClick={() => deleteProject(draftProject.id)}>Delete project</button>}</div></div></div></div>}
          </section>
        </div>
      </div>
      <footer className="dashboard-footer dashboard-shell"><span>ROEUN VATHANA / CONTENT STUDIO</span><span>Next.js + NestJS + PostgreSQL</span></footer>
    </main>
  );
}
