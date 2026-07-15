import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Calendar, Mail, Phone, MessageSquare, CheckCircle } from "lucide-react";
import { getBookingById } from "../../services/bookingService";
import StatusBadge from "../../components/booking/StatusBadge";
import PaymentUpload from "../../components/booking/PaymentUpload";
import ReviewForm from "../../components/review/ReviewForm";

const paymentStatusLabels = {
  not_submitted: "Not submitted",
  pending_verification: "Pending verification",
  verified: "Payment verified",
  rejected: "Payment rejected",
};

export default function BookingDetail() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const fetchBooking = async () => {
    try {
      const res = await getBookingById(id);
      setBooking(res.data.data);
    } catch (err) {
      setError("Could not load this booking.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  if (error || !booking) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-red-500">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold capitalize">{booking.eventType} Booking</h1>
          <div className="mt-1 flex items-center gap-1 text-sm text-text-muted">
            <Calendar size={14} />
            {new Date(booking.eventDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>

      <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-bg-surface p-5 text-sm">
        <div className="flex items-center gap-2 text-text-muted">
          <Mail size={14} />
          {booking.clientEmail}
        </div>
        {booking.clientPhone && (
          <div className="flex items-center gap-2 text-text-muted">
            <Phone size={14} />
            {booking.clientPhone}
          </div>
        )}
        {booking.message && (
          <div className="flex items-start gap-2 text-text-muted">
            <MessageSquare size={14} className="mt-0.5" />
            {booking.message}
          </div>
        )}
      </div>

      {/* Payment section */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Payment Status</h2>
          <span className="text-xs text-text-muted">
            {paymentStatusLabels[booking.paymentStatus]}
          </span>
        </div>

        {booking.paymentStatus === "not_submitted" && booking.status !== "cancelled" && (
          <PaymentUpload bookingId={booking._id} onSuccess={() => fetchBooking()} />
        )}

        {booking.paymentScreenshot && (
          <div className="mt-4 rounded-xl border border-border bg-bg-surface p-4">
            <p className="mb-2 text-xs text-text-muted">Submitted screenshot:</p>
            <img
              src={booking.paymentScreenshot}
              alt="Payment proof"
              className="max-h-64 rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      {/* Review section — only for completed bookings */}
      {booking.status === "completed" && (
        <div className="mt-6">
          <h2 className="mb-3 text-sm font-semibold">Your Experience</h2>

          {reviewSubmitted ? (
            <div className="flex items-center gap-2 rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-500">
              <CheckCircle size={16} />
              Thanks! Your review has been submitted.
            </div>
          ) : (
            <ReviewForm
              bookingId={booking._id}
              clientEmail={booking.clientEmail}
              onSuccess={() => setReviewSubmitted(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}