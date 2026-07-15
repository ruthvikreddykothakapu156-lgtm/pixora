import { useState } from "react";
import { Star } from "lucide-react";
import { createReview } from "../../services/reviewService";

export default function ReviewForm({ bookingId, clientEmail, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createReview({
        bookingId,
        clientEmail,
        rating,
        comment,
      });
      onSuccess(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-bg-surface p-5">
      <h3 className="mb-3 text-sm font-semibold">Leave a Review</h3>

      {error && (
        <div className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-500">
          {error}
        </div>
      )}

      <div className="mb-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            aria-label={`Rate ${star} stars`}
          >
            <Star
              size={24}
              className={
                star <= (hoverRating || rating)
                  ? "fill-accent text-accent"
                  : "text-border"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        rows={3}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Share your experience with this photographer..."
        className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
      />

      <button
        type="submit"
        disabled={submitting}
        className="mt-3 w-full rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
      >
        {submitting ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}