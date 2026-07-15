import { useEffect, useState } from "react";
import { BadgeCheck, Trash2 } from "lucide-react";
import { getPhotographers, updatePhotographer, deletePhotographer } from "../../services/photographerService";
import AdminTabs from "../../components/dashboard/AdminTabs";

export default function ManagePhotographers() {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchPhotographers = async () => {
    try {
      const res = await getPhotographers();
      setPhotographers(res.data.data);
    } catch (err) {
      setError("Could not load photographers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotographers();
  }, []);

  const handleToggleVerify = async (photographerId, current) => {
    setBusyId(photographerId);
    try {
      await updatePhotographer(photographerId, { isVerified: !current });
      setPhotographers((prev) =>
        prev.map((p) => (p._id === photographerId ? { ...p, isVerified: !current } : p))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update verification.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (photographerId) => {
    if (!confirm("Delete this photographer profile permanently?")) return;
    setBusyId(photographerId);
    try {
      await deletePhotographer(photographerId);
      setPhotographers((prev) => prev.filter((p) => p._id !== photographerId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete photographer.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <AdminTabs />

      <h1 className="text-2xl font-bold">Manage Photographers</h1>
      <p className="mt-1 text-sm text-text-muted">{photographers.length} total photographers</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-surface text-xs text-text-muted">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {photographers.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3 text-text-muted">{p.email}</td>
                <td className="px-4 py-3 text-text-muted">{p.location || "—"}</td>
                <td className="px-4 py-3">
                  {p.isVerified ? (
                    <span className="flex items-center gap-1 text-xs text-accent">
                      <BadgeCheck size={14} /> Verified
                    </span>
                  ) : (
                    <span className="text-xs text-text-muted">Not verified</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleVerify(p._id, p.isVerified)}
                      disabled={busyId === p._id}
                      className="rounded-lg border border-border px-3 py-1.5 text-xs hover:bg-bg-surface disabled:opacity-50"
                    >
                      {p.isVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      disabled={busyId === p._id}
                      className="rounded-lg border border-red-500/30 p-1.5 text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}