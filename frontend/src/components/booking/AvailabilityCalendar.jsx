import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

function isDateBooked(date, bookedRanges) {
  return bookedRanges.some((range) => {
    const start = new Date(range.eventDate);
    const end = new Date(range.endDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d >= start && d <= end;
  });
}

export default function AvailabilityCalendar({ bookedRanges = [] }) {
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthLabel = viewDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const goPrevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const goNextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="rounded-xl border border-border bg-bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={goPrevMonth} className="rounded-lg p-1.5 hover:bg-bg" aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="text-sm font-medium">{monthLabel}</span>
        <button onClick={goNextMonth} className="rounded-lg p-1.5 hover:bg-bg" aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="py-1">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const date = new Date(year, month, day);
          const booked = isDateBooked(date, bookedRanges);
          const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

          return (
            <div
              key={i}
              className={`rounded-lg py-2 text-center text-xs ${
                booked
                  ? "bg-red-500/15 text-red-500"
                  : isPast
                  ? "text-text-muted opacity-30"
                  : "text-text"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-text-muted">
        <span className="h-3 w-3 rounded bg-red-500/15" />
        Booked
      </div>
    </div>
  );
}