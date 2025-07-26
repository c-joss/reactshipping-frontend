import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function QuoteForm() {
  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [containerId, setContainerId] = useState("");

  useEffect(() => {
    fetch(`${ProcessingInstruction.env.REACT_APP_API_URL}/containers`)
      .then((res) => res.json())
      .then(setContainers);
  }, []);

  const origins = [...new Set(portPairs.map((p) => p.load))];
  const destinations = portPairs
    .filter((p) => p.load === origin)
    .map((p) => p.destination);

  return <h1>Quote Form</h1>;
}

export default QuoteForm;
