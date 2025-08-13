import { useLocation } from "react-router-dom";

function BookingConfirmation() {
  const { state } = useLocation() || {};

  const origin = state?.origin || "";
  const destination = state?.destination || "";
  const containerType = state?.containerType || "";
  const transitTime = state?.transitTime || "";

  const name = state?.customer?.name ?? state?.customerName ?? "";
  const email = state?.customer?.email ?? state?.email ?? "";

  return (
    <div>
      <h1>Booking Requested</h1>

      <p>
        <strong>Name:</strong> {name}
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
