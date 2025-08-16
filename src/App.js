import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import QuoteForm from "./components/QuoteForm";
import QuoteResult from "./components/QuoteResult";
import BookingForm from "./components/BookingForm";
import BookingConfirmation from "./components/BookingConfirmation";
import BookingsList from "./components/BookingsList";

function App() {
  const [bookings, setBookings] = useState([]);

  function addBooking(newBooking) {
    setBookings((prev) => [...prev, newBooking]);
  }

  return (
    <div className="app-container">
      <Router>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/quote" element={<QuoteForm />} />
          <Route path="/quote/result" element={<QuoteResult />} />
          <Route
            path="/booking"
            element={<BookingForm addBooking={addBooking} />}
          />
          <Route
            path="/bookings"
            element={<BookingsList bookings={bookings} />}
          />
          <Route
            path="/booking/confirmation"
            element={<BookingConfirmation />}
          />
        </Routes>
        <div
          style={{ display: "none" }}
          data-bookings-count={bookings.length}
        />
      </Router>
    </div>
  );
}
export default App;
