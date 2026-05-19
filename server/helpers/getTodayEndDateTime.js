function getTodayEndDateTime() {
  const end = new Date();
  end.setHours(23, 59, 0, 0);
  return end.toISOString();
}

module.exports = {
  getTodayEndDateTime,
};
