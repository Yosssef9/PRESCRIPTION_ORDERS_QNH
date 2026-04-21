// export function formatDate(dateString) {
//   if (!dateString) return "-";

//   const date = new Date(dateString);

//   if (isNaN(date)) return "-";

//   return new Intl.DateTimeFormat("en-GB", {
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(date);
// }

export function formatDate(value) {
  if (!value) return "-";

  if (typeof value === "string") {
    const normalized = value.replace("T", " ").replace("Z", "");
    const [datePart, timePart] = normalized.split(" ");

    if (!datePart) return value;

    const [year, month, day] = datePart.split("-");
    if (!year || !month || !day) return value;

    return timePart
      ? `${day}/${month}/${year} ${timePart.slice(0, 5)}`
      : `${day}/${month}/${year}`;
  }

  return String(value);
}
