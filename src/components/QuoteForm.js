import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

function QuoteForm() {
  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  const [selectedOrigin, setSelectedOrigin] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState([]);
  const [selectedContainerIds, setSelectedContainerIds] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/portPairs`).then((r) => r.json()),
      fetch(`${process.env.REACT_APP_API_URL}/containers`).then((r) =>
        r.json()
      ),
      fetch(`${process.env.REACT_APP_API_URL}/quotes`).then((r) => r.json()),
    ]).then(([pp, cs, qs]) => {
      setPortPairs(pp || []);
      setContainers(cs || []);
      setQuotes(qs || []);
    });
  }, []);

  const origins = useMemo(
    () => [...new Set(portPairs.map((p) => p.load))],
    [portPairs]
  );

  const destinations = useMemo(() => {
    if (selectedOrigin.length === 0) {
      return [...new Set(portPairs.map((p) => p.destination))];
    }
    return [
      ...new Set(
        portPairs
          .filter((p) => selectedOrigin.includes(p.load))
          .map((p) => p.destination)
      ),
    ];
  }, [portPairs, selectedOrigin]);

  const toggle = (value, setter) =>
    setter((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );

  const handleSubmit = (e) => {
    e.preventDefault();

    const odPairs = [];
    for (const o of selectedOrigin)
      for (const d of selectedDestination) odPairs.push([o, d]);

    const picked = [];
    const seen = new Set();
    for (const [o, d] of odPairs) {
      const pair = portPairs.find((p) => p.load === o && p.destination === d);
      if (!pair) continue;
      const q = quotes.find((qq) => Number(qq.portPairId) === Number(pair.id));
      if (q && !seen.has(q.id)) {
        picked.push(q);
        seen.add(q.id);
      }
    }

    navigate("/quote/result", {
      state: {
        quotes: picked,
        selectedContainerIds: selectedContainerIds.map(Number),
        selectedOrigin,
        selectedDestination,
      },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Get Quotes</h1>

      <fieldset>
        <legend>Origin (multi-select)</legend>
        {origins.map((o) => (
          <label key={o} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedOrigin.includes(o)}
              onChange={() => toggle(o, setSelectedOrigin)}
            />
            {o}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Destination (multi-select)</legend>
        {destinations.map((d) => (
          <label key={d} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedDestination.includes(d)}
              onChange={() => toggle(d, setSelectedDestination)}
            />
            {d}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Container (multi-select)</legend>
        {containers.map((c) => (
          <label key={c.id} style={{ display: "block" }}>
            <input
              type="checkbox"
              checked={selectedContainerIds.includes(c.id)}
              onChange={() => toggle(c.id, setSelectedContainerIds)}
            />
            {c.type}
          </label>
        ))}
      </fieldset>

      <button
        type="submit"
        disabled={
          selectedOrigin.length === 0 ||
          selectedDestination.length === 0 ||
          selectedContainerIds.length === 0
        }
      >
        Show Quotes
      </button>
    </form>
  );
}

export default QuoteForm;
