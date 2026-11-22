"use client";

import { useState, type FormEvent } from "react";

type Labels = {
  name: string; contact: string; message: string; send: string;
  sending: string; sent: string; error: string;
};

/**
 * Works without a backend: if `endpoint` is empty it opens the visitor's email app.
 * Set `contact.formEndpoint` in site.config.ts to post to Formspree, Basin or your own API instead.
 */
export function ContactForm({ endpoint, email, labels, subject }: {
  endpoint: string; email: string; labels: Labels; subject: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("company")) return; // honeypot

    if (!endpoint) {
      const body = `${data.get("message")}\n\n${data.get("name")}\n${data.get("contact")}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      return;
    }

    setState("sending");
    try {
      const res = await fetch(endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
      setState(res.ok ? "sent" : "error");
      if (res.ok) form.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") return <p className="form-note" role="status">{labels.sent}</p>;

  return (
    <form className="form" onSubmit={onSubmit}>
      <label>
        {labels.name}
        <input name="name" required autoComplete="name" />
      </label>
      <label>
        {labels.contact}
        <input name="contact" required autoComplete="tel" />
      </label>
      <label>
        {labels.message}
        <textarea name="message" rows={4} required />
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" className="hp" aria-hidden />
      <button className="btn btn-primary" disabled={state === "sending"}>
        {state === "sending" ? labels.sending : labels.send}
      </button>
      {state === "error" && <p className="form-note" role="alert">{labels.error}</p>}
    </form>
  );
}
