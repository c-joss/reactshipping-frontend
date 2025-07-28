import { useLocation } from "react-router-dom";

function BookingConfirmation() {
  const { state } = useLocation();
  const {
    customerName = "",
    email = "",
    origin = "",
    destination = "",
    containerType = "",
    transitTime = "",
  } = state || {};

  return (
    <div>
      <h1>Booking Requested</h1>
      <p>
        <strong>Name:</strong> {customerName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Origin:</strong> {origin}
      </p>
      <p>
        <strong>Destination:</strong> {destination}
      </p>
      <p>
        <strong>Container:</strong> {containerType}
      </p>
      <p>
        <strong>Transit Time:</strong> {transitTime || "N/A"}
      </p>
    </div>
  );
}

export default BookingConfirmation;
