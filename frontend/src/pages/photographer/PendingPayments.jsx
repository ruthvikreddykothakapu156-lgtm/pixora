import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { getPendingPayments, updatePaymentStatus } from "../../services/bookingService";
import DashboardTabs from "../../components/dashboard/DashboardTabs";

export default function PendingPayments() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const fetchPending = async () => {
    try {
      const res = await getPendingPayments(user.photographerProfile);
      setBookings(res.data.data);
    } catch (err) {
      setError("Could not load pending payments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerify = async (bookingId, decision) => {
    setUpdatingId(bookingId);
    try {
      await updatePaymentStatus(bookingId, decision);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      alert(err.response?.data?.message || "Could not update payment status.");
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

      <h1 className="text-2xl font-bold">Pending Payments</h1>
      <p className="mt-1 text-sm text-text-muted">Review and verify submitted payment screenshots.</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      {!error && bookings.length === 0 && (
        <p className="mt-10 text-sm text-text-muted">No payments awaiting verification.</p>
      )}

      <div className="mt-8 flex flex-col gap-6">
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
                <p className="mt-1 text-xs text-text-muted">{booking.clientEmail}</p>
              </div>
            </div>

            {booking.paymentScreenshot && (
              <img
                src={booking.paymentScreenshot}
                alt="Payment screenshot"
                className="mt-4 max-h-64 rounded-lg border border-border object-contain"
              />
            )}

            <div className="mt-4 flex gap-2">
              <button
                onClick={() => handleVerify(booking._id, "verified")}
                disabled={updatingId === booking._id}
                className="rounded-lg bg-accent-gradient px-4 py-2 text-xs font-medium text-white disabled:opacity-50"
              >
                Verify Payment
              </button>
              <button
                onClick={() => handleVerify(booking._id, "rejected")}
                disabled={updatingId === booking._id}
                className="rounded-lg border border-red-500/30 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-500/10 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}