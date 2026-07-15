import { Camera, Users, ShieldCheck, Award } from "lucide-react";

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-extrabold">
        <span className="bg-accent-gradient bg-clip-text text-transparent">About</span> Pixora
      </h1>
      <p className="mt-4 text-text-muted">
        Pixora is a photography portfolio and booking platform built to connect talented
        photographers with clients looking to capture their most important moments. Whether
        it's a wedding, a portrait session, or a corporate event, Pixora makes it simple to
        discover the right photographer, review their work, and book them with confidence.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Camera size={18} />
          </div>
          <h3 className="text-sm font-semibold">Curated Portfolios</h3>
          <p className="mt-1 text-xs text-text-muted">
            Every photographer showcases their work through organized, categorized albums.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Users size={18} />
          </div>
          <h3 className="text-sm font-semibold">Verified Professionals</h3>
          <p className="mt-1 text-xs text-text-muted">
            Photographers can be verified by our team, adding an extra layer of trust.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <ShieldCheck size={18} />
          </div>
          <h3 className="text-sm font-semibold">Transparent Booking</h3>
          <p className="mt-1 text-xs text-text-muted">
            Real-time availability calendars and clear pricing per event type, before you book.
          </p>
        </div>
        <div className="rounded-xl border border-border bg-bg-surface p-5">
          <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <Award size={18} />
          </div>
          <h3 className="text-sm font-semibold">Genuine Reviews</h3>
          <p className="mt-1 text-xs text-text-muted">
            Reviews are only accepted from clients with a completed booking — no fake ratings.
          </p>
        </div>
      </div>
    </div>
  );
}