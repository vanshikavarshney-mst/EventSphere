/**
 * generateSeats.js
 * --------------------------------------------------
 * Automatically generates the seat layout for a new event.
 *
 * Layout used for every event (kept fixed/simple on purpose):
 *   Front  -> F1  to F20  (20 seats)
 *   Middle -> M1  to M30  (30 seats)
 *   Back   -> B1  to B50  (50 seats)
 *
 * Total = 100 seats per event.
 *
 * Returns an array of seat objects that matches the
 * "seats" sub-schema defined in models/Event.js
 */
const generateSeats = (basePrice = 0) => {
  const seats = [];
  const price = Number(basePrice) || 0;
  const frontPrice = Number((price * 1.3).toFixed(2));
  const middlePrice = Number((price * 1.1).toFixed(2));
  const backPrice = price;

  // Front row seats
  for (let i = 1; i <= 20; i++) {
    seats.push({
      seatNumber: `F${i}`,
      category: "Front",
      status: "Available",
      price: frontPrice,
    });
  }

  // Middle row seats
  for (let i = 1; i <= 30; i++) {
    seats.push({
      seatNumber: `M${i}`,
      category: "Middle",
      status: "Available",
      price: middlePrice,
    });
  }

  // Back row seats
  for (let i = 1; i <= 50; i++) {
    seats.push({
      seatNumber: `B${i}`,
      category: "Back",
      status: "Available",
      price: backPrice,
    });
  }

  return seats;
};

module.exports = generateSeats;
