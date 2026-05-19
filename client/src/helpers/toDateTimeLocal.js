function toDateTimeLocal(date) {
  return date.toISOString().slice(0, 16);
}

export function getTodayStartEnd() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 0, 0);

  return {
    start: toDateTimeLocal(start),
    end: toDateTimeLocal(end),
  };
}
