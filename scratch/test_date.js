
const reservations = [
  { reservation_id: 1, check_in_date: "2026-05-05T00:00:00.000Z" },
  { reservation_id: 2, check_in_date: "2026-05-01T00:00:00.000Z" },
  { reservation_id: 6, check_in_date: "2026-06-12T00:00:00.000Z" }
];

const todayStr = new Date().toISOString().split('T')[0];
console.log('Today (UTC):', todayStr);

const arrivalsToday = reservations.filter(
  (reservation) => reservation.check_in_date.split('T')[0] === todayStr
).length;

console.log('Arrivals Today:', arrivalsToday);
