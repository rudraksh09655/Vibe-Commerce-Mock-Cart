// frontend/src/api.js
// Centralized API helper for Vibe Commerce frontend
// - Supports optional userId (query param) using REACT_APP_USER_ID or runtime setter
// - Throws errors on non-OK responses, logs helpful info

const API = process.env.REACT_APP_API_URL || 'http://localhost:4000';
// default user id (can be overridden by setUserId)
let CURRENT_USER = process.env.REACT_APP_USER_ID ? Number(process.env.REACT_APP_USER_ID) : 1;

function log(...args) {
  // small wrapper so you can disable later if needed
  // console.log('API:', ...args);
  console.log('[API]', ...args);
}

/**
 * Builds a full URL and appends userId as query param when present.
 * Ensures path begins with '/'
 */
function url(path, opts = {}) {
  const userId = opts.userId !== undefined ? opts.userId : CURRENT_USER;
  const p = path.startsWith('/') ? path : '/' + path;
  if (userId === null || userId === undefined) return `${API}${p}`;
  // if path already has query params, append with &
  return `${API}${p}${p.includes('?') ? '&' : '?'}userId=${encodeURIComponent(userId)}`;
}

/**
 * Helper to parse JSON and throw helpful errors
 */
async function handleResponse(res) {
  const text = await res.text();
  try {
    const data = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const message = data && data.error ? data.error : res.statusText || 'API error';
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  } catch (parseErr) {
    // Parsing failed (server returned HTML or empty) — include raw text
    const err = new Error(`Invalid JSON response (status ${res.status})`);
    err.status = res.status;
    err.raw = text;
    throw err;
  }
}

/** PUBLIC: allow changing current user at runtime */
export function setUserId(id) {
  if (id === null || id === undefined) CURRENT_USER = null;
  else CURRENT_USER = Number(id);
  log('setUserId ->', CURRENT_USER);
}

/** PUBLIC: get current user id */
export function getUserId() {
  return CURRENT_USER;
}

/** API: fetch products */
export async function fetchProducts() {
  const u = url('/api/products');
  log('GET', u);
  const res = await fetch(u);
  return handleResponse(res);
}

/** API: fetch cart (for CURRENT_USER) */
export async function fetchCart(userId) {
  const u = url('/api/cart', { userId });
  log('GET', u);
  const res = await fetch(u);
  return handleResponse(res);
}

/** API: add to cart - body { productId, qty } */
export async function addToCart(productId, qty = 1, userId) {
  const u = url('/api/cart', { userId });
  log('POST', u, { productId, qty });
  const res = await fetch(u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId, qty })
  });
  return handleResponse(res);
}

/** API: remove from cart - uses cart item id (scoped to user) */
export async function removeFromCart(cartItemId, userId) {
  const u = url(`/api/cart/${encodeURIComponent(cartItemId)}`, { userId });
  log('DELETE', u);
  const res = await fetch(u, { method: 'DELETE' });
  return handleResponse(res);
}

/** API: checkout - body { cartItems, name, email } - returns { receipt } */
export async function checkout(cartItems = [], name = null, email = null, userId) {
  const u = url('/api/checkout', { userId });
  log('POST', u, { cartItems, name, email });
  const res = await fetch(u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cartItems, name, email })
  });
  return handleResponse(res);
}

/** API: create mock user (returns user record) */
export async function createUser({ name, email }) {
  const u = url('/api/users', { userId: null }); // creating user doesn't need userId
  log('POST', u, { name, email });
  const res = await fetch(u, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email })
  });
  return handleResponse(res);
}

/** API: get user by id */
export async function getUser(id) {
  const u = `${API}/api/users/${encodeURIComponent(id)}`;
  log('GET', u);
  const res = await fetch(u);
  return handleResponse(res);
}

/** Convenience: reload products + cart together */
export async function fetchProductsAndCart(userId) {
  const [products, cart] = await Promise.all([fetchProducts(), fetchCart(userId)]);
  return { products, cart };
}

/** Export default (optional) */
export default {
  setUserId,
  getUserId,
  fetchProducts,
  fetchCart,
  addToCart,
  removeFromCart,
  checkout,
  createUser,
  getUser,
  fetchProductsAndCart,
};
