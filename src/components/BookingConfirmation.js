import React from 'react';
import { useLocation, Link } from 'react-router-dom';

function BookingConfirmation() {
  const { state } = useLocation() || {};
  const origin = state?.origin || '';
  const destination = state?.destination || '';
  const containerType = state?.containerType || '';
  const transitTime = state?.transitTime || '';
  const name = state?.customer?.name ?? state?.customerName ?? '';
  const email = state?.customer?.email ?? state?.email ?? '';
  const company = state?.customer?.company ?? state?.company ?? '';
  const nextBatch = Array.isArray(state?.nextBatch) ? state.nextBatch : [];

  return (
    <div className="confirm-wrapper">
      <div className="confirm-card">
        <h1>Booking Requested</h1>
        <div className="confirm-details">
          <div className="label">Name:</div>
          <div className="value">{name}</div>
          <div className="label">Email:</div>
          <div className="value">{email}</div>
          <div className="label">Company:</div>
          <div className="value">{company}</div>
          <div className="label">Origin:</div>
          <div className="value">{origin}</div>
          <div className="label">Destination:</div>
          <div className="value">{destination}</div>
          <div className="label">Container:</div>
          <div className="value">{containerType}</div>
          <div className="label">Transit Time:</div>
          <div className="value">{transitTime || 'N/A'}</div>
        </div>
        {nextBatch.length > 0 && (
          <p>
            <Link to="/booking" state={{ batch: nextBatch }}>
              Book next selection
            </Link>
          </p>
        )}
        <p>
          <Link to="/bookings">View all bookings</Link>
        </p>
      </div>
    </div>
  );
}

export default BookingConfirmation;
