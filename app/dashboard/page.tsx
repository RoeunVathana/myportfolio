"use client";

import { FormEvent, useMemo, useState } from "react";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
};

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function DashboardPage() {
  const [key, setKey] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [state, setState] = useState<"locked" | "loading" | "ready" | "error">("locked");
  const [errorMessage, setErrorMessage] = useState("");

  async function openInbox(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch(`${apiUrl}/api/contact`, {
        headers: { "x-dashboard-key": key },
      });
      if (response.status === 401) throw new Error("invalid-key");
      if (!response.ok) throw new Error("api-error");
      const data = (await response.json()) as { messages: Message[] };
      setMessages(data.messages);
      setState("ready");
    } catch (error) {
      const isRemoteLocalApi = typeof window !== "undefined" && window.location.hostname !== "localhost" && apiUrl.includes("localhost");
      setErrorMessage(error instanceof Error && error.message === "invalid-key"
        ? "That dashboard key is not valid."
        : isRemoteLocalApi
          ? "This remote dashboard still points to localhost. Deploy the NestJS API and set NEXT_PUBLIC_API_URL."
          : "The NestJS API is offline. Start both services with npm run dev, then try again.");
      setState("error");
    }
  }

  const latestMessage = messages[0];
  const latestDate = latestMessage ? formatDate(latestMessage.createdAt) : "—";
  const latestSender = latestMessage?.name ?? "No messages yet";
  const totalCharacters = useMemo(() => messages.reduce((total, item) => total + item.message.length, 0), [messages]);

  return (
    <main className="dashboard-page">
      <nav className="dashboard-nav dashboard-shell" aria-label="Dashboard navigation">
        <a className="dashboard-brand" href="/">NOAH<span>.</span><small>/ COMMAND CENTER</small></a>
        <a className="dashboard-back" href="/">Back to portfolio <span>↗</span></a>
      </nav>

      <div className="dashboard-shell">
        <section className="dashboard-hero">
          <p className="dashboard-kicker"><span /> PRIVATE WORKSPACE / 01</p>
          <h1>Good work<br /><em>starts here.</em></h1>
          <p>One quiet place for the signals that come in through your portfolio. Contact messages are stored in PostgreSQL and stay behind this access gate.</p>
        </section>

        {state !== "ready" ? (
          <section className="dashboard-lock-card">
            <div className="lock-orb"><span>↗</span></div>
            <div>
              <p className="dashboard-kicker"><span /> OWNER ACCESS</p>
              <h2>Open the inbox.</h2>
              <p>Enter your private dashboard key to load messages from the NestJS API.</p>
            </div>
            <form className="dashboard-login" onSubmit={openInbox}>
              <label htmlFor="dashboard-key">Dashboard key</label>
              <div className="dashboard-key-row"><input id="dashboard-key" type="password" value={key} onChange={(event) => setKey(event.target.value)} placeholder="••••••••••••" required /><button className="dashboard-button" type="submit" disabled={state === "loading"}>{state === "loading" ? "Opening..." : "Open inbox ↗"}</button></div>
              {state === "error" && <p className="dashboard-error">{errorMessage}</p>}
            </form>
          </section>
        ) : (
          <>
            <section className="dashboard-toolbar"><div><p className="dashboard-kicker"><span className="green-dot" /> LIVE INBOX</p><h2>Signals received.</h2></div><button className="dashboard-refresh" type="button" onClick={() => { setState("locked"); setKey(""); setMessages([]); }}>Lock dashboard</button></section>
            <section className="dashboard-stats" aria-label="Inbox summary"><article><span>Total signals</span><strong>{messages.length.toString().padStart(2, "0")}</strong><small>Stored messages</small></article><article><span>Latest sender</span><strong className="stat-text">{latestSender}</strong><small>{latestDate}</small></article><article><span>Inbox volume</span><strong>{totalCharacters.toString().padStart(3, "0")}</strong><small>Characters received</small></article></section>
            <section className="dashboard-inbox"><div className="inbox-heading"><h3>Recent messages</h3><span>{messages.length} visible / 100 max</span></div>{messages.length === 0 ? <div className="empty-inbox">No messages yet. Your next good conversation will appear here.</div> : <div className="message-list">{messages.map((message) => <article className="message-row" key={message.id}><div className="message-avatar">{message.name.slice(0, 1).toUpperCase()}</div><div className="message-main"><div className="message-topline"><h4>{message.name}</h4><time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time></div><a href={`mailto:${message.email}`}>{message.email}</a><p>{message.message}</p></div><a className="message-reply" href={`mailto:${message.email}?subject=Re: your message to Noah`}>Reply ↗</a></article>)}</div>}</section>
          </>
        )}
      </div>
      <footer className="dashboard-footer dashboard-shell"><span>NOAH / PRIVATE WORKSPACE</span><span>Next.js + NestJS + PostgreSQL</span></footer>
    </main>
  );
}
