import { useEffect, useState } from "react";
import { getAllBookings, deleteBooking } from "../../services/bookingService";
import StatusBadge from "../../components/booking/StatusBadge";
import AdminTabs from "../../components/dashboard/AdminTabs";

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await getAllBookings();
        setBookings(res.data.data);
      } catch (err) {
        setError("Could not load bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Delete this booking permanently?")) return;
    setBusyId(id);
    try {
      await deleteBooking(id);
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete booking.");
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

      <h1 className="text-2xl font-bold">Manage Bookings</h1>
      <p className="mt-1 text-sm text-text-muted">{bookings.length} total bookings</p>

      {error && <p className="mt-8 text-sm text-red-500">{error}</p>}

      <div className="mt-8 overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-bg-surface text-xs text-text-muted">
            <tr>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-3">
                  <div>{b.clientName}</div>
                  <div className="text-xs text-text-muted">{b.clientEmail}</div>
                </td>
                <td className="px-4 py-3 capitalize text-text-muted">{b.eventType}</td>
                <td className="px-4 py-3 text-text-muted">
                  {new Date(b.eventDate).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={b.status} />
                </td>
                <td className="px-4 py-3 text-xs capitalize text-text-muted">
                  {b.paymentStatus.replace("_", " ")}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleDelete(b._id)}
                    disabled={busyId === b._id}
                    className="rounded-lg border border-red-500/30 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}