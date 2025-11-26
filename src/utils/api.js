const RAW_BASE = process.env.REACT_APP_API_URL || '';

const BASE_URL = RAW_BASE.replace(/\/+$/, '');

function makeUrl(path) {
  if (!path) throw new Error('path is required');

  const p = path.startsWith('/') ? path : `/${path}`;

  if (!BASE_URL) throw new Error('REACT_APP_API_URL is not set');

  return `${BASE_URL}${p}`;
}

async function request(path, options = {}) {
  const res = await fetch(makeUrl(path), options);

  if (!res.ok) {
    const err = new Error(`Request failed: ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

const JSON_HEADERS = { 'Content-Type': 'application/json' };

// QuoteForm - api.get()
// QuoteResult - api.get()
// BookingForm - api.get(), api.post()
export const api = {
  get(path) {
    return request(path);
  },

  post(path, body) {
    return request(path, {
      method: 'POST',
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    });
  },
};
