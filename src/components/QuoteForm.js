import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuoteForm() {
  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);

  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedContainerIds, setSelectedContainerIds] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/portPairs`)
      .then((res) => res.json())
      .then(setPortPairs);
  }, []);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/containers`)
      .then((res) => res.json())
      .then(setContainers);
  }, []);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    Promise.all(
      selectedOrigin.flatMap((origin) =>
        selectedDestination.flatMap((destination) =>
          selectedContainerIds.map((containerId) =>
            fetch(
              `${process.env.REACT_APP_API_URL}/quotes?origin=${origin}&destination=${destination}&containerId=${containerId}`
            ).then((res) => res.json())
          )
        )
      )
    )
    .then((results) => {
      const quotes = results.flat().filter(Boolean);
      navigate("/quote/result", {
        state: {
          quotes,
        },
      });
    });
  };

  const origins = [...new Set(portPairs.map((p) => p.load))];
  const destinations = [
    ...new Set(
      portPairs
        .filter((p) => selectedOrigin.includes(p.load))
        .map((p) => p.destination)
    ),
  ];

  return (
    <form onSubmit={handleSubmit}>
      <h1>Quote Form</h1>
      <label>Origin</label>
      <div>
        {origins.map((origin) => (
          <label key={origin} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={origin}
              checked={selectedOrigin.includes(origin)}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedOrigin((prev) =>
                  e.target.checked
                    ? [...prev, val]
                    : prev.filter((o) => o !== val)
                );
              }}
            ></input>
            {origin}
          </label>
        ))}
      </div>
      <label>Destination</label>
      <div>
        {destinations.map((destination) => (
          <label key={destination} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={destination}
              checked={selectedDestination.includes(destination)}
              onChange={(e) => {
                const val = e.target.value;
                setSelectedDestination((prev) =>
                  e.target.checked
                    ? [...prev, val]
                    : prev.filter((d) => d !== val)
                );
              }}
            ></input>
            {destination}
          </label>
        ))}
      </div>
      <label>Container Type</label>
      <div>
        {containers.map((container) => (
          <label key={container.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              value={container.id}
              checked={selectedContainerIds.includes(container.id)}
              onChange={(e) => {
                const id = parseInt(e.target.value);
                setSelectedContainerIds((prev) =>
                  e.target.checked
                    ? [...prev, id]
                    : prev.filter((cid) => cid !== id)
                );
              }}
            ></input>
            {container.type}
          </label>
        ))}
      </div>
      <button type="submit">Get Quote</button>
    </form>
  );
}
export default QuoteForm;
