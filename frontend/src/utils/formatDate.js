/**
 * Formats a date string/object into a readable Indian-locale date.
 * Example: formatDate("2026-12-01") -> "1 December 2026"
 */
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Formats a date into a shorter form.
 * Example: formatDateShort("2026-12-01") -> "1 Dec 2026"
 */
export function formatDateShort(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Formats a date range. If start and end are the same day, shows just one date.
 * Example: formatDateRange("2026-12-01", "2026-12-03") -> "1 – 3 December 2026"
 */
export function formatDateRange(startDate, endDate) {
  if (!startDate) return "";
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : start;

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return formatDate(start);
  }

  const sameMonth = start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear();

  if (sameMonth) {
    const startDay = start.getDate();
    const endLabel = formatDate(end);
    return `${startDay} – ${endLabel}`;
  }

  return `${formatDate(start)} – ${formatDate(end)}`;
}