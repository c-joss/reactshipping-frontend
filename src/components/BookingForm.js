import { useLocation } from "react-router-dom";
import { useState } from "react";

function BookingForm() {
  const { state } = useLocation();
  const { origin, destination, containerType, quote } = state || {};

  const [customerName, setCustomerName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <form>
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
