import { Link } from "react-router-dom";

function Home() {
  return (
    <>
      <h1>Home</h1>
      <ul>
        <li>
          <Link to="/quote">Get a Quote</Link>
        </li>
      </ul>
    </>
  );
}

export default Home;
