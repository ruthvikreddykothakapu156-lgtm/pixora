import { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // No backend contact endpoint exists yet — this is a front-end only confirmation for now.
    setSent(true);
  };

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-extrabold">Get in Touch</h1>
      <p className="mt-2 text-text-muted">
        Questions, feedback, or partnership inquiries — we'd love to hear from you.
      </p>

      <div className="mt-8 flex flex-col gap-3 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          support@pixora.example
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={14} />
          Hyderabad, India
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-xl border border-border bg-bg-surface p-6">
        {sent && (
          <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-500">
            Thanks for reaching out! We'll get back to you soon.
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium">Name</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Message</label>
          <textarea
            rows={4}
            required
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
        </div>

        <button
          type="submit"
          className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white"
        >
          <Send size={14} />
          Send Message
        </button>
      </form>
    </div>
  );
}