export default function renderSortArrow(sortState, columnKey) {
  if (sortState.key !== columnKey) return "↕";
  return sortState.direction === "asc" ? "↑" : "↓";
}
