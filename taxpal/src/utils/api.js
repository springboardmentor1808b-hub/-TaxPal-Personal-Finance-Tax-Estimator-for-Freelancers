// simple wrapper around fetch that includes auth token and JSON headers
const BASE_URL = import.meta.env.VITE_API_BASE || 'http://localhost:5000';

export async function api(path, options = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(BASE_URL + path, { ...options, headers });
  return res;
}
