const generateMonths = (fromDate, toDate = new Date()) => {
  const months = [];
  const start = new Date(fromDate);
  start.setDate(1);

  while (start <= toDate) {
    const year = start.getFullYear();
    const month = String(start.getMonth() + 1).padStart(2, '0');
    months.push(`${year}-${month}`);
    start.setMonth(start.getMonth() + 1);
  }

  return months;
};

module.exports = generateMonths;