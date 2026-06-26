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
const generateSeats = ({
  frontSeats,
  middleSeats,
  backSeats,
  frontPrice,
  middlePrice,
  backPrice,
}) => {
  const seats = [];

  for (let i = 1; i <= frontSeats; i++) {
    seats.push({
      seatNumber: `F${i}`,
      category: "Front",
      status: "Available",
      price: frontPrice,
    });
  }

  for (let i = 1; i <= middleSeats; i++) {
    seats.push({
      seatNumber: `M${i}`,
      category: "Middle",
      status: "Available",
      price: middlePrice,
    });
  }

  for (let i = 1; i <= backSeats; i++) {
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
