import { useLocation } from "react-router-dom";
import { useState } from "react";

function BookingForm() {
  const { state } = useLocation();
  const { origin, destination, containerType, rate, transitTime } = state || {};

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      customerName,
      email,
      origin,
      destination,
      containerType,
      quote: {
        freight: rate.freight,
        thc: rate.thc,
        doc: rate.doc,
        dhc: rate.dhc,
        lss: rate.lss,
        transitTime,
      },
    };

    fetch(`${process.env.REACT_APP_API_URL}/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newBooking),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Booking Requested!");
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Booking Form</h1>
      <p>Origin: {origin}</p>
      <p>Destination: {destination}</p>
      <p>Container Type: {containerType}</p>

      <label>Customer Name</label>
      <input
        type="text"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        required
      ></input>

      <button type="submit">Request Booking</button>
    </form>
  );
}

export default BookingForm;
