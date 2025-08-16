import React from "react";

export default function BookingsList({ bookings = [] }) {
  if (!bookings.length) return <p>No bookings yet.</p>;
  return (
    <div>
      <h1>Bookings</h1>
      <ul>
        {bookings.map((b, i) => (
          <li key={b.id ?? i}>
            {b.customer?.name || "Unknown"} — {b.origin} → {b.destination} —{" "}
            {b.containerType} — ${b.charges?.freight ?? "N/A"}
          </li>
        ))}
      </ul>
    </div>
  );
}
