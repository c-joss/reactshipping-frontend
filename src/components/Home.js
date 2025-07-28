import { Link } from "react-router-dom";
import paperBoat from "../images/paper-boat.com.png";

function Home() {
  return (
    <div className="home-container">
      <header className="hero-banner">
        <h1>Davie Jones Shipping</h1>
      </header>
      <nav className="home-links">
        <ul>
          <li>
            <Link to="/quote">Get a Quote</Link>
          </li>
          <li>
            <Link to="/booking">Request a Booking</Link>
          </li>
        </ul>
      </nav>

      <div className="home-image">
        <img src={paperBoat} alt="Paper Boat" />
      </div>
    </div>
  );
}

export default Home;
