import { useEffect, useState } from "react";
import { Calendar, Mail } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getBookingsByPhotographer, updateBookingStatus } from "../../services/bookingService";
import StatusBadge from "../../components/booking/StatusBadge";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

const nextStatusOptions = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

export default function ReceivedBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await getBookingsByPhotographer(user.photographerProfile);
      setBookings(res.data.data);
    } catch (err) {
      setError("Could not load bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    setUpdatingId(bookingId);
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      alert(err.response?.data?.message || "Could not update status.");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <DashboardTabs />

      <h1 className="text-2xl font-bold">Received Bookings</h1>
      <p className="mt-1 text-sm text-text-muted">Manage booking requests from clients.</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      {!error && bookings.length === 0 && (
        <p className="mt-10 text-sm text-text-muted">No bookings yet.</p>
      )}

      <div className="mt-8 flex flex-col gap-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="rounded-xl border border-border bg-bg-surface p-5">
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
                <div className="mt-1 flex items-center gap-1 text-xs text-text-muted">
                  <Mail size={12} />
                  {booking.clientEmail}
                </div>
              </div>
              <StatusBadge status={booking.status} />
            </div>

            {booking.message && (
              <p className="mt-3 text-sm text-text-muted">{booking.message}</p>
            )}

            {nextStatusOptions[booking.status]?.length > 0 && (
              <div className="mt-4 flex gap-2">
                {nextStatusOptions[booking.status].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(booking._id, status)}
                    disabled={updatingId === booking._id}
                    className={`rounded-lg px-4 py-2 text-xs font-medium capitalize disabled:opacity-50 ${
                      status === "cancelled"
                        ? "border border-red-500/30 text-red-500 hover:bg-red-500/10"
                        : "bg-accent-gradient text-white"
                    }`}
                  >
                    Mark as {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}