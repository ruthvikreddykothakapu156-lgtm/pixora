import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Send, Mail, Calendar as CalendarIcon } from "lucide-react";
import { getPhotographerById } from "../../services/photographerService";
import { createBooking, getAvailability } from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import AvailabilityCalendar from "../../components/booking/AvailabilityCalendar";

const steps = [
  { title: "Send Booking Request", desc: "Fill in your details and requirements" },
  { title: "Get Confirmation", desc: "Photographer will review and confirm" },
  { title: "Capture Moments", desc: "Enjoy your special moments beautifully captured" },
];

export default function BookPhotographer() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photographer, setPhotographer] = useState(null);
  const [bookedRanges, setBookedRanges] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [clientName, setClientName] = useState(user?.name || "");
  const [clientEmail, setClientEmail] = useState(user?.email || "");
  const [eventType, setEventType] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [photoRes, availRes] = await Promise.all([
          getPhotographerById(id),
          getAvailability(id),
        ]);
        setPhotographer(photoRes.data.data);
        setBookedRanges(availRes.data.data);
      } catch (err) {
        setError("Could not load this photographer.");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchData();
  }, [id]);

  const selectedPrice = photographer?.pricing?.find((p) => p.eventType === eventType)?.price;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await createBooking({
        photographer: id,
        clientName,
        clientEmail,
        eventType,
        eventDate,
        endDate: endDate || eventDate,
        message,
      });
      setSuccess(true);
      setTimeout(() => navigate(`/my-bookings/${res.data.data._id}`), 1200);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send booking request.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingProfile) {
    return <p className="mx-auto max-w-7xl px-6 py-20 text-center text-text-muted">Loading...</p>;
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="text-2xl font-bold">
        Book {photographer?.name || "Photographer"}
      </h1>
      <p className="mt-1 text-sm text-text-muted">
        Fill in the details below to send a booking request.
      </p>

      <div className="mt-8 grid gap-8 md:grid-cols-[1fr,320px]">
        <div className="order-2 md:order-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-bg-surface p-6">
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-500">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-500">
                Booking request sent! Redirecting...
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium">Full Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2.5">
                <Mail size={14} className="text-text-muted" />
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Event Type</label>
              <select
                required
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
              >
                <option value="">Select event type</option>
                <option value="wedding">Wedding</option>
                <option value="portrait">Portrait</option>
                <option value="corporate">Corporate</option>
                <option value="wildlife">Wildlife</option>
                <option value="pre-wedding">Pre-wedding</option>
                <option value="other">Other</option>
              </select>
              {selectedPrice != null && (
                <p className="mt-1 text-xs font-medium text-accent">
                  Starting price for {eventType}: ₹{selectedPrice.toLocaleString("en-IN")}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">Event Start Date</label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2.5">
                  <CalendarIcon size={14} className="text-text-muted" />
                  <input
                    type="date"
                    required
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Event End Date</label>
                <div className="flex items-center gap-2 rounded-lg border border-border bg-bg px-4 py-2.5">
                  <CalendarIcon size={14} className="text-text-muted" />
                  <input
                    type="date"
                    min={eventDate || undefined}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Same as start if left blank"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-lg border border-border bg-bg px-4 py-2.5 text-sm outline-none focus:border-accent"
                placeholder="Tell us about your requirements..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-accent-gradient px-4 py-2.5 text-sm font-medium text-white disabled:opacity-60"
            >
              <Send size={14} />
              {submitting ? "Sending..." : "Send Booking Request"}
            </button>
          </form>
        </div>

        <div className="order-1 flex flex-col gap-6 md:order-2">
          <div className="rounded-xl border border-border bg-bg-surface p-6">
            <h2 className="mb-6 text-sm font-semibold">How it works</h2>
            <div className="flex flex-col gap-6">
              {steps.map((step, i) => (
                <div key={step.title} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent-gradient text-xs font-bold text-white">
                      {i + 1}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-1 h-full w-px flex-1 bg-border" />
                    )}
                  </div>
                  <div className="pb-2">
                    <h3 className="text-sm font-medium">{step.title}</h3>
                    <p className="mt-0.5 text-xs text-text-muted">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold">Availability</h2>
            <AvailabilityCalendar bookedRanges={bookedRanges} />
          </div>
        </div>
      </div>
    </div>
  );
}