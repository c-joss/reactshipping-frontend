import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function BookingForm() {
  const { state } = useLocation() || {};
  const { origin, destination, containerType, rate, transitTime } = state || {};

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    origin: state?.origin || "",
    destination: state?.destination || "",
    containerType: state?.containerType || "",
    transitTime: state?.transitTime || "",
    freight: state?.rate?.freight || "",
    thc: state?.rate?.thc || "",
    doc: state?.rate?.doc || "",
    dhc: state?.rate?.dhc || "",
    lss: state?.rate?.lss || "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const newBooking = {
      customerName: formData.companyName,
      email: formData.email,
      origin: formData.origin,
      destination: formData.destination,
      containerType: formData.containerType,
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
        navigate("/booking/confirmation", {
          state: {
            customerName: formData.companyName,
            email: formData.email,
            origin: formData.origin,
            destination: formData.destination,
            containerType: formData.containerType,
            transitTime: formData.transitTime,
          },
        });
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Booking Form</h1>
      <label>
        Company Name:
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>
      <label>
        Origin:
        <input
          type="text"
          name="origin"
          value={formData.origin}
          onChange={handleChange}
        />
      </label>
      <label>
        Destination:
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
        />
      </label>
      <label>
        Container Type:
        <input
          type="text"
          name="containerType"
          value={formData.containerType}
          onChange={handleChange}
        />
      </label>

      <button type="submit">Request Booking</button>
    </form>
  );
}

export default BookingForm;
