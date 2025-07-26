import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function QuoteForm() {
  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [containerId, setContainerId] = useState("");

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/containers`)
      .then((res) => res.json())
      .then(setContainers);
  }, []);

  const origins = [...new Set(portPairs.map((p) => p.load))];
  const destinations = portPairs
    .filter((p) => p.load === origin)
    .map((p) => p.destination);

  return (
    <form>
      <h1>Quote Form</h1>
      <label>Origin</label>
      <select
        value={origin}
        onChange={(e) => setOrigin(e.target.value)}
        required
      >
        <option value="">Select</option>
        {origins.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <label>Destination</label>
      <select
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        required
      >
        <option value="">Select</option>
        {destinations.map((d) => (
          <option key={d}>{d}</option>
        ))}
      </select>
      <label>Container Type</label>
      <select
        value={containerId}
        onChange={(e) => setContainerId(e.target.value)}
        required
      >
        <option value="">Select</option>
        {containers.map((c) => (
          <option key={c.id}>{c.type}</option>
        ))}
      </select>
      <button type="submit">Get Quote</button>
    </form>
  );
}
export default QuoteForm;
