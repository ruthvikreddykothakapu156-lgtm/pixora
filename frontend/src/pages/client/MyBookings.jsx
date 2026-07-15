import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin } from "lucide-react";
import { getMyBookings } from "../../services/bookingService";
import StatusBadge from "../../components/booking/StatusBadge";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getMyBookings();
        setBookings(res.data.data);
      } catch (err) {
        setError("Could not load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-2xl font-bold">My Bookings</h1>
      <p className="mt-1 text-sm text-text-muted">Track the status of your booking requests.</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      {!error && bookings.length === 0 && (
        <p className="mt-10 text-sm text-text-muted">
          You haven't made any bookings yet.{" "}
          <Link to="/photographers" className="text-accent">Browse photographers</Link>
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {bookings.map((booking) => (
          <Link
            key={booking._id}
            to={`/my-bookings/${booking._id}`}
            className="rounded-xl border border-border bg-bg-surface p-5 hover:border-accent/50"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold capitalize">{booking.eventType}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                  <Calendar size={12} />
                  {new Date(booking.eventDate).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>
            {booking.message && (
              <p className="mt-3 truncate text-sm text-text-muted">{booking.message}</p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}