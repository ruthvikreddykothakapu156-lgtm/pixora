export default function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
        <Icon size={18} />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 text-xs text-text-muted">{label}</div>
    </div>
  );
}