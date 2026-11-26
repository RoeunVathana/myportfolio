"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

type PublicProject = { id: string; title: string; tag: string; description: string; accent: string; link: string };
type PublicProfile = { displayName: string; role: string; intro: string; about: string; location: string; availability: string; email: string; avatarUrl: string };
type PublicSiteInfo = { stack: string; currently: string; location: string; contactEmail: string; github: string; linkedin: string };
type GitHubRepo = { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; archived?: boolean };

const fallbackProfile: PublicProfile = {
  displayName: "Roeun Vathana",
  role: "FULL-STACK DEVELOPER / 2025",
  intro: "I'm Roeun Vathana — I design and engineer expressive digital products for people with something worth saying.",
  about: "I like the part where a fuzzy idea becomes something you can touch. My work lives at the intersection of thoughtful product design, playful technology, and the tiny details that make a screen feel human.",
  location: "Bangkok / GMT+7",
  availability: "Available for select projects",
  email: "hello@noah.dev",
  avatarUrl: "",
};

const fallbackSiteInfo: PublicSiteInfo = {
  stack: "Next.js + NestJS",
  currently: "Building for the web",
  location: "Bangkok / GMT+7",
  contactEmail: "hello@noah.dev",
  github: "https://github.com/RoeunVathana",
  linkedin: "https://linkedin.com",
};

const fallbackProjects: PublicProject[] = [
  {
    id: "orbit-finance",
    title: "Orbit Finance",
    tag: "Product system",
    description: "A calm, high-signal finance workspace for teams that want clarity without the spreadsheet sprawl.",
    accent: "project-orbit",
    link: "#",
  },
  {
    id: "mori-objects",
    title: "Mori Objects",
    tag: "E-commerce experience",
    description: "A tactile storefront with a tiny carbon footprint, built around thoughtful objects and quiet motion.",
    accent: "project-mori",
    link: "#",
  },
  {
    id: "studio-42",
    title: "Studio / 42",
    tag: "Creative tooling",
    description: "A shared visual playground where a distributed creative team can think, remix, and ship together.",
    accent: "project-studio",
    link: "#",
  },
];

const githubUsername = "RoeunVathana";
const fallbackGitHubRepos: GitHubRepo[] = [
  "myportfolio", "nestjs-ecommerce-2026", "ToolAi", "miniapi", "Project-Trading", "soktheaj", "MageShop", "schoolManagement", "Soktheajr", "ReactJsICTAt2_4", "projectComputeruseJavaSpringBoot", "learnNestJs", "computer_ecommerce", "Api_Trading_Deploy", "NodeApiSecond", "nodeApiFirst", "JavaSpringBootKruTy", "ApiForDart", "NewHotelManagement", "learnNextjs", "Hotel_management", "DeployApiCafeManagement", "CafeManagementPayment", "projectBakong", "JavaSpringBootOnlineFinish", "JavaSpringBootSetec",
].map((name, index) => ({ id: index + 1, name, html_url: `https://github.com/${githubUsername}/${name}`, description: null, language: null, stargazers_count: 0 }));

const portfolioApiUrl = process.env.NEXT_PUBLIC_API_URL ?? (process.env.NODE_ENV === "production"
  ? "https://noah-portfolio-api.vivaciousdandelion4.chatgpt.site"
  : "http://localhost:4000");

function SparkIcon({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" className="spark-icon" width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 1v22M1 12h22M4.3 4.3l15.4 15.4M19.7 4.3 4.3 19.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 17 17" fill="none">
      <path d="M2.4 14.5 14.5 2.4M5.5 2.5h9v9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BrandMark({ name }: { name: string }) {
  return (
    <a className="brand" href="#top" aria-label={`${name} home`}>
      <span className="brand-orb" />
      <span>{name}<span className="brand-dot">.</span></span>
    </a>
  );
}

function HeroScene({ avatarUrl }: { avatarUrl: string }) {
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onPointerMove = (event: PointerEvent) => {
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      scene.style.setProperty("--mx", x.toFixed(3));
      scene.style.setProperty("--my", y.toFixed(3));
      scene.style.setProperty("--rx", `${(-y * 5).toFixed(2)}deg`);
      scene.style.setProperty("--ry", `${(x * 7).toFixed(2)}deg`);
    };

    const resetPointer = () => {
      scene.style.setProperty("--mx", "0");
      scene.style.setProperty("--my", "0");
      scene.style.setProperty("--rx", "0deg");
      scene.style.setProperty("--ry", "0deg");
    };

    scene.addEventListener("pointermove", onPointerMove);
    scene.addEventListener("pointerleave", resetPointer);
    return () => {
      scene.removeEventListener("pointermove", onPointerMove);
      scene.removeEventListener("pointerleave", resetPointer);
    };
  }, []);

  return (
    <div ref={sceneRef} className="hero-scene" aria-label="Abstract 3D developer workspace illustration" role="img">
      <div className="scene-glow scene-glow-one" />
      <div className="scene-glow scene-glow-two" />
      <div className="orbit-ring orbit-ring-one" />
      <div className="orbit-ring orbit-ring-two" />
      <div className="scene-orb scene-orb-back" />
      <div className="scene-orb scene-orb-main"><span /></div>

      <div className="floating-chip chip-code">
        <span className="chip-bracket">&lt;/&gt;</span>
        <span>BUILD<br />WITH INTENT</span>
      </div>
      <div className="floating-chip chip-stack">
        <span className="stack-dot" />
        <span>NEXT.JS</span>
        <span className="stack-slash">/</span>
        <span>NESTJS</span>
      </div>
      <div className="floating-chip chip-api">
        <span className="api-pulse" />
        <span>API<br />READY</span>
      </div>

      <div className="scene-console">
        <div className="console-topbar">
          <span className="console-lights"><i /><i /><i /></span>
          <span className="console-title">noah.studio / projects</span>
          <span className="console-menu">•••</span>
        </div>
        <div className="console-body">
          <div className="console-sidebar">
            <span className="active" />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="console-content">
            <div className="console-line line-large" />
            <div className="console-line line-small" />
            <div className="console-metrics"><b>84</b><b>12</b><b>99</b></div>
            <div className="console-chart"><span /><span /><span /><span /><span /><span /><span /></div>
          </div>
        </div>
      </div>

      {avatarUrl && <div className="scene-avatar"><img src={avatarUrl} alt="Noah" /></div>}

      <div className="scene-star star-one"><SparkIcon size={42} /></div>
      <div className="scene-star star-two"><SparkIcon size={22} /></div>
      <div className="scene-cross cross-one" />
      <div className="scene-label">01 — SELECTED<br />WORK</div>
    </div>
  );
}

function ProjectVisual({ className }: { className: string }) {
  return (
    <div className={`project-visual ${className}`} aria-hidden="true">
      <div className="visual-card visual-card-back" />
      <div className="visual-card visual-card-front">
        {className === "project-orbit" && <><div className="visual-orbit" /><div className="visual-orbit-dot" /><span className="visual-copy">FLOW<br /><em>STATE</em></span></>}
        {className === "project-mori" && <><div className="visual-arch" /><div className="visual-arch-shadow" /><span className="visual-copy">OBJECT<br /><em>01</em></span></>}
        {className === "project-studio" && <><div className="visual-grid" /><div className="visual-cube" /><span className="visual-copy">PLAY<br /><em>MODE</em></span></>}
      </div>
      <div className="visual-tag">VIEW / CASE</div>
    </div>
  );
}

export default function Home() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [profile, setProfile] = useState(fallbackProfile);
  const [siteInfo, setSiteInfo] = useState(fallbackSiteInfo);
  const [projects, setProjects] = useState(fallbackProjects);
  const [githubRepos, setGitHubRepos] = useState(fallbackGitHubRepos);

  useEffect(() => {
    fetch(`${portfolioApiUrl}/api/content`)
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("Content unavailable")))
      .then((data: { profile: PublicProfile; siteInfo: PublicSiteInfo; projects: Array<PublicProject & { featured?: boolean }> }) => {
        setProfile(data.profile);
        setSiteInfo(data.siteInfo);
        setProjects(data.projects.filter((project) => project.featured !== false));
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`, { headers: { Accept: "application/vnd.github+json" } })
      .then((response) => response.ok ? response.json() : Promise.reject(new Error("GitHub unavailable")))
      .then((data: GitHubRepo[]) => setGitHubRepos(data.filter((repo) => !repo.archived)))
      .catch(() => undefined);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const response = await fetch(`${portfolioApiUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main id="top">
      <nav className="site-nav shell" aria-label="Main navigation">
        <BrandMark name={profile.displayName} />
        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#github">GitHub</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-status" href="#contact"><span />{profile.availability}</a>
      </nav>

      <section className="hero shell">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> {profile.role}</p>
          <h1>Digital things<br /><span>with a pulse.</span></h1>
          <p className="hero-intro">{profile.intro}</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">Explore the work <ArrowIcon /></a>
            <a className="text-link" href="#about">More about me <span>↘</span></a>
          </div>
          <div className="hero-footnote"><SparkIcon size={18} /><span>01 / 04</span><span className="footnote-rule" /><span>Scroll to explore</span></div>
        </div>
        <HeroScene avatarUrl={profile.avatarUrl} />
      </section>

      <section className="marquee" aria-label="Services">
        <div className="marquee-track"><span>PRODUCT THINKING</span><i>✳</i><span>NEXT.JS</span><i>✳</i><span>NESTJS</span><i>✳</i><span>3D INTERACTIONS</span><i>✳</i><span>PRODUCT THINKING</span><i>✳</i><span>NEXT.JS</span><i>✳</i><span>NESTJS</span><i>✳</i><span>3D INTERACTIONS</span></div>
      </section>

      <section className="work-section shell section-pad" id="work">
        <div className="section-heading">
          <div><p className="eyebrow"><span className="eyebrow-line" /> SELECTED WORK</p><h2>A few things<br /><em>I&apos;ve made.</em></h2></div>
          <p className="section-note">A mix of product work, experiments, and the spaces between them. <span>↘</span></p>
        </div>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <article className="project-card" key={project.id}>
              <ProjectVisual className={project.accent} />
              <div className="project-meta"><span>{String(index + 1).padStart(2, "0")} / {project.tag}</span>{project.link && project.link !== "#" ? <a className="project-visit" href={project.link} target="_blank" rel="noreferrer">LIVE SITE ↗</a> : <span className="project-arrow">↗</span>}</div>
              <h3>{project.title}</h3>
              <p>{project.description}</p>{project.link && project.link !== "#" && <a className="project-site-link" href={project.link} target="_blank" rel="noreferrer">Open deployed site <ArrowIcon /></a>}
            </article>
          ))}
        </div>
      </section>

      <section className="github-section shell section-pad" id="github">
        <div className="section-heading"><div><p className="eyebrow"><span className="eyebrow-line" /> OPEN SOURCE / {githubRepos.length} REPOSITORIES</p><h2>Everything<br /><em>I&apos;ve shipped.</em></h2></div><a className="text-link" href={`https://github.com/${githubUsername}`} target="_blank" rel="noreferrer">View GitHub profile</a></div>
        <div className="github-grid">{githubRepos.map((repo) => <a className="github-repo-card" href={repo.html_url} key={repo.id} target="_blank" rel="noreferrer"><div className="github-repo-top"><span className="github-mark">GH</span><span>PUBLIC REPOSITORY</span></div><h3>{repo.name}</h3><p>{repo.description || "A project from Noah's GitHub workspace."}</p><div className="github-repo-meta"><span>{repo.language || "CODE"}</span><span>{repo.stargazers_count > 0 ? `★ ${repo.stargazers_count}` : "OPEN"}</span></div></a>)}</div>
      </section>

      <section className="about-section shell section-pad" id="about">
        <div className="about-stamp"><span>{profile.displayName}</span><small>EST. 2020</small></div>
        <div className="about-copy"><p className="eyebrow"><span className="eyebrow-line" /> A LITTLE ABOUT ME</p><h2>Code is my craft.<br /><em>Curiosity is my compass.</em></h2><p className="about-lead">{profile.about}</p><div className="about-details"><div><span>Based in</span><strong>{siteInfo.location}</strong></div><div><span>Currently</span><strong>{siteInfo.currently}</strong></div><div><span>Favorite stack</span><strong>{siteInfo.stack}</strong></div></div><a className="button button-outline" href="#contact">Let&apos;s make something <ArrowIcon /></a></div>
      </section>

      <section className="contact-section shell section-pad" id="contact">
        <div className="contact-copy"><p className="eyebrow"><span className="eyebrow-line" /> HAVE A GOOD ONE?</p><h2>Let&apos;s make<br /><em>some noise.</em></h2><p>Have a project in mind, a question, or just want to say hello? I&apos;d love to hear what you&apos;re working on.</p><div className="contact-links"><a href={`mailto:${siteInfo.contactEmail}`}>{siteInfo.contactEmail} <span>↗</span></a><a href={siteInfo.github} target="_blank" rel="noreferrer">GitHub <span>↗</span></a><a href={siteInfo.linkedin} target="_blank" rel="noreferrer">LinkedIn <span>↗</span></a></div></div>
        <form className="contact-form" onSubmit={handleSubmit}><label><span>Your name</span><input name="name" placeholder="A real human, hopefully" required /></label><label><span>Email address</span><input name="email" type="email" placeholder="you@somewhere.com" required /></label><label><span>What are we making?</span><textarea name="message" placeholder="Tell me the good stuff..." rows={4} required /></label><button className="button button-primary" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending..." : "Send the signal"} <ArrowIcon /></button>{status === "sent" && <p className="form-message success">Signal received. I&apos;ll be in touch soon.</p>}{status === "error" && <p className="form-message error">The API is offline. Email me directly at hello@noah.dev.</p>}</form>
      </section>

      <footer className="site-footer shell"><BrandMark name={profile.displayName} /><span>Designed + built by {profile.displayName}</span><span>© 2025 / All signal, no noise</span></footer>
    </main>
  );
}
