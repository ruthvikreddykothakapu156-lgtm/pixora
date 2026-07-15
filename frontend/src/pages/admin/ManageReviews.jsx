import { useEffect, useState } from "react";
import { Star, Trash2 } from "lucide-react";
import { getPhotographers } from "../../services/photographerService";
import { getReviewsByPhotographer, deleteReview } from "../../services/reviewService";
import AdminTabs from "../../components/dashboard/AdminTabs";

export default function ManageReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const fetchAllReviews = async () => {
    try {
      const photographersRes = await getPhotographers();
      const photographers = photographersRes.data.data;

      const allReviews = [];
      for (const p of photographers) {
        const res = await getReviewsByPhotographer(p._id);
        res.data.data.forEach((r) => {
          allReviews.push({ ...r, photographerName: p.name });
        });
      }
      setReviews(allReviews);
    } catch (err) {
      setError("Could not load reviews.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this review permanently?")) return;
    setBusyId(id);
    try {
      await deleteReview(id);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete review.");
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <AdminTabs />

      <h1 className="text-2xl font-bold">Manage Reviews</h1>
      <p className="mt-1 text-sm text-text-muted">{reviews.length} total reviews</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      {!error && reviews.length === 0 && (
        <p className="mt-10 text-sm text-text-muted">No reviews yet.</p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {reviews.map((r) => (
          <div key={r._id} className="rounded-xl border border-border bg-bg-surface p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={i < r.rating ? "fill-accent text-accent" : "text-border"}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-text-muted">
                  {r.clientName} → {r.photographerName}
                </p>
              </div>
              <button
                onClick={() => handleDelete(r._id)}
                disabled={busyId === r._id}
                className="rounded-lg p-2 text-text-muted hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
                aria-label="Delete review"
              >
                <Trash2 size={14} />
              </button>
            </div>
            {r.comment && <p className="mt-3 text-sm text-text-muted">{r.comment}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}