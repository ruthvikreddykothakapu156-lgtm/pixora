import { Star } from "lucide-react";

export default function ReviewList({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return <p className="text-sm text-text-muted">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {reviews.map((review) => (
        <div key={review._id} className="rounded-xl border border-border bg-bg-surface p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{review.clientName}</span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={13}
                  className={i < review.rating ? "fill-accent text-accent" : "text-border"}
                />
              ))}
            </div>
          </div>
          {review.comment && (
            <p className="mt-2 text-sm text-text-muted">{review.comment}</p>
          )}
          <p className="mt-2 text-xs text-text-muted">
            {new Date(review.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      ))}
    </div>
  );
}