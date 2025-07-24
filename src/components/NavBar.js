import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav>
      <NavLink to="/" end>
        Home
      </NavLink>{" "}
      | <NavLink to="/quote">Quote</NavLink> |{" "}
      <NavLink to="/booking">Booking</NavLink>
    </nav>
  );
}

export default NavBar;
