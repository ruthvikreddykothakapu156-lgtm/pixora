const statusStyles = {
  pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/30",
  confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
  completed: "bg-green-500/10 text-green-500 border-green-500/30",
  cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs font-medium capitalize ${statusStyles[status] || ""}`}
    >
      {status}
    </span>
  );
}