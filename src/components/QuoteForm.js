import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchJson } from "../utils/api";

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
      fetchJson("/portPairs"),
      fetchJson("/containers"),
      fetchJson("/quotes"),
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
      <p className="help-text">All fields are required.</p>

      <fieldset>
        <legend className="required">Origin (multi-select)</legend>
        {origins.map((o, idx) => (
          <label key={o} className="checkbox-row">
            <input
              type="checkbox"
              name="origin"
              required={selectedOrigin.length === 0 && idx === 0}
              checked={selectedOrigin.includes(o)}
              onChange={() => toggle(o, setSelectedOrigin)}
            />
            <span>{o}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="required">Destination (multi-select)</legend>
        {destinations.map((d, idx) => (
          <label key={d} className="checkbox-row">
            <input
              type="checkbox"
              name="destination"
              required={selectedDestination.length === 0 && idx === 0}
              checked={selectedDestination.includes(d)}
              onChange={() => toggle(d, setSelectedDestination)}
            />
            <span>{d}</span>
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="required">Container (multi-select)</legend>
        {containers.map((c, idx) => (
          <label key={c.id} className="checkbox-row">
            <input
              type="checkbox"
              name="container"
              required={selectedContainerIds.length === 0 && idx === 0}
              checked={selectedContainerIds.includes(c.id)}
              onChange={() => toggle(c.id, setSelectedContainerIds)}
            />
            <span>{c.type}</span>
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
