const API = process.env.REACT_APP_API_URL;
export function fetchJson(path) {
  return fetch(`${API}${path}`).then((r) => r.json());
}
