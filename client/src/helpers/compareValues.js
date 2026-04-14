export default function compareValues(a, b, direction = "asc") {
  const safeA = a ?? "";
  const safeB = b ?? "";

  let result = 0;

  const dateA = new Date(safeA);
  const dateB = new Date(safeB);
  const isDateA = !Number.isNaN(dateA.getTime());
  const isDateB = !Number.isNaN(dateB.getTime());

  if (isDateA && isDateB) {
    result = dateA - dateB;
  } else {
    result = String(safeA).localeCompare(String(safeB), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  }

  return direction === "asc" ? result : -result;
}
