import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import QuoteForm from "./components/QuoteForm";
import QuoteResult from "./components/QuoteResult";
import BookingForm from "./components/BookingForm";
import BookingConfirmation from "./components/BookingConfirmation";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote" element={<QuoteForm />} />
        <Route path="/quote/result" element={<QuoteResult />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/booking/confirmation" element={<BookingConfirmation />} />
      </Routes>
    </Router>
  );
}

export default App;
