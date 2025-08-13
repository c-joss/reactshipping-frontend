import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

function QuoteResult() {
  const { state } = useLocation() || {};
  const {
    quotes: navQuotes = [],
    selectedContainerIds: navCids = [],
    selectedOrigin = [],
    selectedDestination = [],
  } = state || {};

  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);
  const [quotes, setQuotes] = useState(navQuotes);

  const selectedContainerIds = useMemo(
    () => (navCids || []).map(Number),
    [navCids]
  );

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/portPairs`).then((r) => r.json()),
      fetch(`${process.env.REACT_APP_API_URL}/containers`).then((r) =>
        r.json()
      ),
    ]).then(([pp, cs]) => {
      setPortPairs(pp || []);
      setContainers(cs || []);
    });
  }, []);

  useEffect(() => {
    if (navQuotes && navQuotes.length) return;
    fetch(`${process.env.REACT_APP_API_URL}/quotes`)
      .then((r) => r.json())
      .then((all) => setQuotes(all || []));
  }, [navQuotes]);

  const portPairById = useMemo(() => {
    const m = new Map();
    for (const p of portPairs) m.set(Number(p.id), p);
    return m;
  }, [portPairs]);

  const containerById = useMemo(() => {
    const m = new Map();
    for (const c of containers) m.set(Number(c.id), c);
    return m;
  }, [containers]);

  const rows = useMemo(() => {
    if (!quotes.length || !selectedContainerIds.length) return [];
    const out = [];

    for (const q of quotes) {
      const pair = portPairById.get(Number(q.portPairId));
      if (!pair) continue;

      if (selectedOrigin.length && !selectedOrigin.includes(pair.load))
        continue;
      if (
        selectedDestination.length &&
        !selectedDestination.includes(pair.destination)
      )
        continue;

      const rateList = Array.isArray(q.rates) ? q.rates : [];

      for (const cid of selectedContainerIds) {
        const rate = rateList.find(
          (r) => Number(r.containerId) === Number(cid)
        );
        if (!rate) continue;

        out.push({
          origin: pair.load,
          destination: pair.destination,
          containerId: cid,
          containerType: containerById.get(Number(cid))?.type || `#${cid}`,
          transitTime: q.transitTime || "N/A",
          rate,
        });
      }
    }
    return out;
  }, [
    quotes,
    selectedContainerIds,
    selectedOrigin,
    selectedDestination,
    portPairById,
    containerById,
  ]);

  return (
    <div>
      <h1>Quote Result</h1>

      {rows.length === 0 ? (
        <p>No matching rates. Try different selections.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Origin</th>
              <th>Destination</th>
              <th>Container</th>
              <th>Freight</th>
              <th>THC</th>
              <th>DOC</th>
              <th>DHC</th>
              <th>LSS</th>
              <th>Transit</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={`${row.origin}-${row.destination}-${row.containerId}-${idx}`}
              >
                <td>{row.origin}</td>
                <td>{row.destination}</td>
                <td>{row.containerType}</td>
                <td>${row.rate.freight ?? "N/A"}</td>
                <td>${row.rate.thc ?? "N/A"}</td>
                <td>${row.rate.doc ?? "N/A"}</td>
                <td>${row.rate.dhc ?? "N/A"}</td>
                <td>${row.rate.lss ?? "N/A"}</td>
                <td>{row.transitTime}</td>
                <td>
                  <Link
                    to="/booking"
                    state={{
                      origin: row.origin,
                      destination: row.destination,
                      containerType: row.containerType,
                      containerId: Number(row.containerId),
                      rate: row.rate,
                      transitTime: row.transitTime || "",
                    }}
                  >
                    Book Now
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default QuoteResult;
