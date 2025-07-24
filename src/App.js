import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Home from "./components/Home";
import QuoteForm from "./components/QuoteForm";
import QuoteResult from "./components/QuoteResult";
import BookingFormForm from "./components/BookingForm";

function App() {
  return (
    <Router>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>{" "}
        | <NavLink to="/quote">Quote</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/quote" element={<QuoteForm />} />
      </Routes>
    </Router>
  );
}

export default App;
