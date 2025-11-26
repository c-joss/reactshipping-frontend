import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../utils/api';

function QuoteResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location?.state || null;

  const initialQuotes = useMemo(() => (Array.isArray(state?.quotes) ? state.quotes : []), [state]);
  const selectedContainerIds = useMemo(
    () => (Array.isArray(state?.selectedContainerIds) ? state.selectedContainerIds : []),
    [state],
  );
  const selectedOrigin = useMemo(
    () => (Array.isArray(state?.selectedOrigin) ? state.selectedOrigin : []),
    [state],
  );
  const selectedDestination = useMemo(
    () => (Array.isArray(state?.selectedDestination) ? state.selectedDestination : []),
    [state],
  );

  const [quotes, setQuotes] = useState(initialQuotes);
  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/portPairs'),
      api.get('/containers'),
      initialQuotes.length ? Promise.resolve(initialQuotes) : api.get('/quotes'),
    ]).then(([pp, cs, qs]) => {
      setPortPairs(pp || []);
      setContainers(cs || []);
      setQuotes(qs || []);
    });
  }, [initialQuotes]);

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
    const out = [];
    for (const q of quotes) {
      const pair = portPairById.get(Number(q.portPairId));
      if (!pair) continue;
      if (selectedOrigin.length && !selectedOrigin.includes(pair.load)) continue;
      if (selectedDestination.length && !selectedDestination.includes(pair.destination)) continue;
      const rateList = Array.isArray(q.rates) ? q.rates : [];
      for (const cid of selectedContainerIds) {
        const rate = rateList.find((r) => Number(r.containerId) === Number(cid));
        if (!rate) continue;
        out.push({
          origin: pair.load,
          destination: pair.destination,
          containerId: cid,
          containerType: containerById.get(Number(cid))?.type || `#${cid}`,
          transitTime: q.transitTime || 'N/A',
          rate,
        });
      }
    }
    return out;
  }, [
    quotes,
    selectedContainerIds,
    portPairById,
    containerById,
    selectedOrigin,
    selectedDestination,
  ]);

  const [sortAsc, setSortAsc] = useState(true);
  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const fa = Number(a.rate?.freight ?? Infinity);
      const fb = Number(b.rate?.freight ?? Infinity);
      return sortAsc ? fa - fb : fb - fa;
    });
    return copy;
  }, [rows, sortAsc]);

  const [selectedKeys, setSelectedKeys] = useState(() => new Set());
  const toggleRow = (key) =>
    setSelectedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  const selectedRows = useMemo(
    () =>
      sortedRows.filter((row, idx) =>
        selectedKeys.has(`${row.origin}-${row.destination}-${row.containerId}-${idx}`),
      ),
    [sortedRows, selectedKeys],
  );
  const bookSelected = () => {
    if (!selectedRows.length) return;
    navigate('/booking', { state: { batch: selectedRows } });
  };

  return (
    <div>
      <h1>Quote Results</h1>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
        <button onClick={() => setSortAsc((s) => !s)}>Sort by Freight {sortAsc ? '↑' : '↓'}</button>
        <button onClick={bookSelected} disabled={!selectedRows.length}>
          Book Selected
        </button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Select</th>
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
          {sortedRows.map((row, idx) => {
            const key = `${row.origin}-${row.destination}-${row.containerId}-${idx}`;
            return (
              <tr key={key}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedKeys.has(key)}
                    onChange={() => toggleRow(key)}
                  />
                </td>
                <td>{row.origin}</td>
                <td>{row.destination}</td>
                <td>{row.containerType}</td>
                <td>${row.rate.freight ?? 'N/A'}</td>
                <td>${row.rate.thc ?? 'N/A'}</td>
                <td>${row.rate.doc ?? 'N/A'}</td>
                <td>${row.rate.dhc ?? 'N/A'}</td>
                <td>${row.rate.lss ?? 'N/A'}</td>
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
                      transitTime: row.transitTime || '',
                    }}
                  >
                    Book Now
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default QuoteResult;
