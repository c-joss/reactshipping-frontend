import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { findRateForLane } from '../utils/rates';
import { api } from '../utils/api';

function BookingForm({ addBooking }) {
  const { state } = useLocation() || {};
  const navigate = useNavigate();

  const batch = Array.isArray(state?.batch) ? state.batch : null;
  const first = batch && batch.length ? batch[0] : null;
  const remaining = batch && batch.length ? batch.slice(1) : [];

  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');

  const [origin, setOrigin] = useState(first?.origin || state?.origin || '');
  const [destination, setDestination] = useState(first?.destination || state?.destination || '');
  const [containerType, setContainerType] = useState(
    first?.containerType || state?.containerType || '',
  );
  const [containerId, setContainerId] = useState(first?.containerId ?? state?.containerId ?? null);
  const [rate, setRate] = useState(first?.rate || state?.rate || null);
  const [transitTime, setTransitTime] = useState(first?.transitTime || state?.transitTime || '');

  const isPrefilled = Boolean(origin && destination && (containerType || containerId != null));

  const [portPairs, setPortPairs] = useState([]);
  const [containers, setContainers] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    Promise.all([api.get('/portPairs'), api.get('/containers'), api.get('/quotes')]).then(
      ([pp, cs, qs]) => {
        setPortPairs(pp || []);
        setContainers(cs || []);
        setQuotes(qs || []);
      },
    );
  }, []);

  useEffect(() => {
    if (!origin || !destination) return;
    if (rate && transitTime) return;
    const {
      rate: foundRate,
      transitTime: tt,
      resolvedContainerId,
    } = findRateForLane({
      origin,
      destination,
      containerId,
      containerType,
      portPairs,
      quotes,
      containers,
    });
    setRate(foundRate || null);
    setTransitTime(tt || '');
    if (containerId == null && resolvedContainerId != null) setContainerId(resolvedContainerId);
  }, [
    origin,
    destination,
    containerId,
    containerType,
    portPairs,
    quotes,
    containers,
    rate,
    transitTime,
  ]);

  const origins = useMemo(() => [...new Set(portPairs.map((p) => p.load))], [portPairs]);

  const destinations = useMemo(() => {
    if (!origin) return [...new Set(portPairs.map((p) => p.destination))];
    return [...new Set(portPairs.filter((p) => p.load === origin).map((p) => p.destination))];
  }, [portPairs, origin]);

  const containerOptions = useMemo(
    () => containers.map((c) => ({ id: c.id, type: c.type })),
    [containers],
  );

  const displayContainerType = useMemo(() => {
    if (containerType) return containerType;
    const found = containers.find((c) => Number(c.id) === Number(containerId));
    if (found?.type) return found.type;
    return containerId != null ? `#${containerId}` : '';
  }, [containerType, containers, containerId]);

  const validateMissing = () => {
    const missing = [];
    if (!name?.trim()) missing.push('Name');
    if (!company?.trim()) missing.push('Company');
    if (!email?.trim()) missing.push('Email');
    if (!isPrefilled) {
      if (!origin) missing.push('Origin');
      if (!destination) missing.push('Destination');
      if (!containerType && containerId == null) missing.push('Container');
    }
    return missing;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const missing = validateMissing();
    if (missing.length) {
      alert(`Please complete: ${missing.join(', ')}`);
      return;
    }
    if (!rate) {
      alert('No rate found for this selection. Please adjust your lane or container.');
      return;
    }
    const resolvedType =
      containerType || containers.find((c) => Number(c.id) === Number(containerId))?.type || '';
    const booking = {
      origin,
      destination,
      containerType: resolvedType,
      transitTime: transitTime || 'N/A',
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

    api.post('/bookings', booking).then((saved) => {
      if (typeof addBooking === 'function') addBooking(saved);
      navigate('/booking/confirmation', {
        state: { ...saved, nextBatch: remaining },
      });
    });
  };

  return (
    <div>
      <h1>Booking</h1>

      {isPrefilled ? (
        <div>
          <p>
            <strong>Origin:</strong> {origin}
          </p>
          <p>
            <strong>Destination:</strong> {destination}
          </p>
          <p>
            <strong>Container:</strong> {displayContainerType}
          </p>
          <p>
            <strong>Transit Time:</strong> {transitTime || 'N/A'}
          </p>
          <p>
            <strong>Charges:</strong>{' '}
            {rate
              ? `$${rate.freight} Freight, $${rate.thc} THC, $${rate.doc} DOC, $${rate.dhc} DHC, $${rate.lss} LSS`
              : 'Looking up.'}
          </p>
        </div>
      ) : (
        <div>
          <div>
            <label>Origin</label>
            <select
              value={origin}
              onChange={(e) => {
                setOrigin(e.target.value);
                setDestination('');
                setRate(null);
              }}
            >
              <option value="">Select origin</option>
              {origins.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Destination</label>
            <select
              value={destination}
              onChange={(e) => {
                setDestination(e.target.value);
                setRate(null);
              }}
            >
              <option value="">Select destination</option>
              {destinations.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Container</label>
            <select
              value={containerId ?? ''}
              onChange={(e) => {
                setContainerId(e.target.value ? Number(e.target.value) : null);
                setContainerType('');
                setRate(null);
              }}
            >
              <option value="">Select container</option>
              {containerOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <p>
              <strong>Transit Time:</strong> {transitTime || ''}
            </p>
            <p>
              <strong>Charges:</strong>{' '}
              {rate
                ? `$${rate.freight} Freight, $${rate.thc} THC, $${rate.doc} DOC, $${rate.dhc} DHC, $${rate.lss} LSS`
                : origin && destination && (containerType || containerId != null)
                ? 'No rate found'
                : ''}
            </p>
          </div>
        </div>
      )}

      <form noValidate onSubmit={handleSubmit}>
        <div>
          <label className="label-text required">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="label-text required">Company</label>
          <input value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div>
          <label className="label-text required">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <button type="submit">Confirm Booking</button>
      </form>
    </div>
  );
}

export default BookingForm;
