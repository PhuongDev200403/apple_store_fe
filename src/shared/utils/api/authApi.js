const BASE_URL = 'http://localhost:8080/api';

export async function login({ email, password }) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    // Expect backend returns { code, message }
    const message = data?.message || 'Đăng nhập thất bại';
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data; // { token, role }
}

export async function register(payload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || 'Đăng ký thất bại';
    const error = new Error(message);
    error.code = data?.code;
    throw error;
  }
  return data;
}

