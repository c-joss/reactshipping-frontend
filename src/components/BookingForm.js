import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function BookingForm({ addBooking }) {
  const { state } = useLocation() || {};
  const {
    origin: navOrigin = "",
    destination: navDestination = "",
    containerType: navContainerType = "",
    containerId: navContainerId = null,
    rate: navRate = null,
    transitTime: navTransit = "",
  } = state || {};

  const isPrefilled = Boolean(
    navOrigin && navDestination && (navContainerType || navContainerId != null)
  );

  const [origin, setOrigin] = useState(isPrefilled ? navOrigin : "");
  const [destination, setDestination] = useState(
    isPrefilled ? navDestination : ""
  );
  const [containerType, setContainerType] = useState(
    isPrefilled ? navContainerType : ""
  );
  const [containerId, setContainerId] = useState(
    navContainerId != null ? Number(navContainerId) : null
  );
  const [transitTime, setTransitTime] = useState(isPrefilled ? navTransit : "");
  const [rate, setRate] = useState(isPrefilled ? navRate : null);

  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (isPrefilled && navRate) return;
    setLoading(true);
    Promise.all([
      fetch(`${process.env.REACT_APP_API_URL}/portPairs`).then((r) => r.json()),
      fetch(`${process.env.REACT_APP_API_URL}/containers`).then((r) =>
        r.json()
      ),
      fetch(`${process.env.REACT_APP_API_URL}/quotes`).then((r) => r.json()),
    ])
      .then(([pp, cs, qs]) => {
        setPortPairs(pp || []);
        setContainers(cs || []);
        setQuotes(qs || []);
      })
      .finally(() => setLoading(false));
  }, [isPrefilled, navRate]);

  const origins = useMemo(
    () => [...new Set(portPairs.map((p) => p.load))],
    [portPairs]
  );

  const destinations = useMemo(() => {
    if (!origin) return [...new Set(portPairs.map((p) => p.destination))];
    return [
      ...new Set(
        portPairs.filter((p) => p.load === origin).map((p) => p.destination)
      ),
    ];
  }, [portPairs, origin]);

  useEffect(() => {
    if (isPrefilled && navRate) return;
    if (!origin || !destination || (!containerType && containerId == null)) {
      setRate(null);
      setTransitTime("");
      return;
    }
    const pair = portPairs.find(
      (p) => p.load === origin && p.destination === destination
    );
    if (!pair) {
      setRate(null);
      setTransitTime("");
      return;
    }
    const quote = quotes.find((q) => Number(q.portPairId) === Number(pair.id));
    if (!quote) {
      setRate(null);
      setTransitTime("");
      return;
    }
    let cid = containerId;
    if (cid == null && containerType) {
      const c = containers.find(
        (x) =>
          String(x.type).trim().toLowerCase() ===
          String(containerType).trim().toLowerCase()
      );
      if (c) cid = Number(c.id);
    }
    if (cid == null) {
      setRate(null);
      setTransitTime(quote.transitTime || "");
      return;
    }
    const found =
      Array.isArray(quote.rates) &&
      quote.rates.find((r) => Number(r.containerId) === Number(cid));
    setRate(found || null);
    setTransitTime(quote.transitTime || "");
    if (containerId == null && cid != null) setContainerId(cid);
  }, [
    isPrefilled,
    navRate,
    origin,
    destination,
    containerType,
    containerId,
    portPairs,
    quotes,
    containers,
  ]);

  const validateMissing = () => {
    const missing = [];
    if (!name?.trim()) missing.push("Name");
    if (!company?.trim()) missing.push("Company");
    if (!email?.trim()) missing.push("Email");
    if (!isPrefilled) {
      if (!origin) missing.push("Origin");
      if (!destination) missing.push("Destination");
      if (!containerType && containerId == null) missing.push("Container");
    }
    return missing;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missing = validateMissing();
    if (missing.length) {
      alert(`Please complete: ${missing.join(", ")}`);
      return;
    }

    if (!rate) {
      alert(
        "No rate found for this selection. Please adjust your lane or container."
      );
      return;
    }

    const cType =
      containerType ||
      containers.find((c) => Number(c.id) === Number(containerId))?.type ||
      "";

    const booking = {
      origin,
      destination,
      containerType: cType,
      transitTime: transitTime || "N/A",
      charges: {
        freight: rate.freight ?? null,
        thc: rate.thc ?? null,
        doc: rate.doc ?? null,
        dhc: rate.dhc ?? null,
        lss: rate.lss ?? null,
      },
      customer: { name, company, email },
      createdAt: new Date().toISOString(),
    };

    fetch(`${process.env.REACT_APP_API_URL}/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(booking),
    })
      .then((r) => r.json())
      .then((saved) => {
        if (typeof addBooking === "function") addBooking(saved);
        navigate("/booking/confirmation", { state: saved });
      });
  };

  return (
    <div>
      <h1>Booking</h1>
      <p className="help-text">All fields are required.</p>

      {isPrefilled ? (
        <div style={{ marginBottom: 12 }}>
          <div>
            <strong>Origin:</strong> {origin}
          </div>
          <div>
            <strong>Destination:</strong> {destination}
          </div>
          <div>
            <strong>Container:</strong>{" "}
            {containerType ||
              containers.find((c) => Number(c.id) === Number(containerId))
                ?.type ||
              "-"}
          </div>
          <div>
            <strong>Transit:</strong>{" "}
            {transitTime || (loading ? "Looking up…" : "N/A")}
          </div>
          <div>
            <strong>Charges:</strong>{" "}
            {rate
              ? `Freight $${rate.freight ?? "N/A"}, THC $${
                  rate.thc ?? "N/A"
                }, DOC $${rate.doc ?? "N/A"}, DHC $${rate.dhc ?? "N/A"}, LSS $${
                  rate.lss ?? "N/A"
                }`
              : loading
              ? "Looking up rate…"
              : "No rate found"}
          </div>
        </div>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <div>
            <label>
              <span className="label-text required">Origin</span>
              <select
                value={origin}
                required
                onChange={(e) => {
                  setOrigin(e.target.value);
                  setDestination("");
                }}
              >
                <option value="">Select origin…</option>
                {origins.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              <span className="label-text required">Destination</span>
              <select
                value={destination}
                required={!!origin}
                disabled={!origin}
                onChange={(e) => setDestination(e.target.value)}
              >
                <option value="">
                  {origin ? "Select destination…" : "Choose origin first"}
                </option>
                {destinations.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div>
            <label>
              <span className="label-text required">Container</span>
              <select
                value={containerType}
                required
                onChange={(e) => {
                  setContainerType(e.target.value);
                  setContainerId(null);
                }}
              >
                <option value="">Select container…</option>
                {containers.map((c) => (
                  <option key={c.id} value={c.type}>
                    {c.type}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div style={{ marginTop: 8 }}>
            <strong>Transit:</strong>{" "}
            {transitTime ||
              (origin && destination && containerType
                ? loading
                  ? "Looking up…"
                  : "N/A"
                : "-")}
          </div>
          <div>
            <strong>Charges:</strong>{" "}
            {rate
              ? `Freight $${rate.freight ?? "N/A"}, THC $${
                  rate.thc ?? "N/A"
                }, DOC $${rate.doc ?? "N/A"}, DHC $${rate.dhc ?? "N/A"}, LSS $${
                  rate.lss ?? "N/A"
                }`
              : origin && destination && (containerType || containerId != null)
              ? loading
                ? "Looking up rate…"
                : "No rate found for this selection"
              : "-"}
          </div>
        </div>
      )}

      <form noValidate>
        <label>
          <span className="label-text required">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            type="text"
          />
        </label>
        <br />
        <label>
          <span className="label-text required">Company</span>
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            type="text"
          />
        </label>
        <br />
        <label>
          <span className="label-text required">Email</span>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
          />
        </label>
        <br />
        <button type="button" onClick={handleSubmit}>
          Confirm Booking
        </button>
      </form>
    </div>
  );
}

export default BookingForm;
