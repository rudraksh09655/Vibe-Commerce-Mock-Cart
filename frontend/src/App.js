import React, { useEffect, useState } from 'react';
import { fetchProducts, fetchCart, addToCart, removeFromCart, checkout } from './api';
import Products from './components/Products';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import { formatINR } from './utils/currency';
import { IconRefresh, IconSun, IconMoon } from './icons';
import './styles.css';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [showCheckout, setShowCheckout] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('vc-theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('vc-theme', theme);
  }, [theme]);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const p = await fetchProducts();
      setProducts(Array.isArray(p) ? p : []);
    } catch (err) {
      console.error('fetchProducts failed', err);
      setError('Failed to load products');
    }

    try {
      const c = await fetchCart();
      setCart(c && typeof c === 'object' ? c : { items: [], total: 0 });
    } catch (err) {
      console.error('fetchCart failed', err);
      setError(prev => prev ? prev + '; failed to load cart' : 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd(productId) {
    try {
      await addToCart(productId, 1);
      const latest = await fetchCart();
      setCart(latest);
    } catch (err) {
      console.error('addToCart failed', err);
      setError('Add to cart failed');
    }
  }

  async function handleRemove(cartId) {
    try {
      await removeFromCart(cartId);
      setCart(await fetchCart());
    } catch (err) {
      console.error('removeFromCart failed', err);
      setError('Remove failed');
    }
  }

async function handleCheckout(formData) {
  // formData will include { name, email, currency }
  try {
    const payload = cart.items.map(i => ({ productId: i.productId, qty: i.qty }));
    console.log('App.handleCheckout payload:', payload, formData);

    // Call backend (cartItems in USD)
    const res = await checkout(payload, formData.name, formData.email);

    if (!res || !res.receipt) throw new Error('Invalid checkout response');

    // res.receipt.total is backend's total (USD)
    const finalReceipt = { ...res.receipt };

    // If user selected INR, augment receipt with convertedTotal and currency flag
    if (formData.currency === 'INR') {
      finalReceipt.convertedTotalINR = formatINR(finalReceipt.total);
      finalReceipt.chosenCurrency = 'INR';
    } else {
      finalReceipt.chosenCurrency = 'USD';
    }

    setReceipt(finalReceipt);
    setShowCheckout(false);
    setCart({ items: [], total: 0 });
  } catch (err) {
    console.error('handleCheckout error:', err);
    setError(err.message || 'Checkout failed');
    throw err;
  }
}

  return (
    <div className="vc-app">
      <header className="vc-header">
        <div className="vc-brand">
          <div className="vc-logo">V</div>
          <div>
            <h1>Vibe Commerce</h1>
            <div className="subtitle">Mock E-com Cart</div>
          </div>
        </div>

        <div className="vc-actions">
          <button className="btn ghost" onClick={() => load()} title="Reload data">
            <IconRefresh />
          </button>

          <button
            className="btn ghost"
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            title="Toggle theme"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <IconMoon /> : <IconSun />}
          </button>

          <button
            className="btn primary"
            onClick={() => setShowCheckout(true)}
            disabled={!cart.items.length}
            title="Checkout"
          >
            Checkout <span className="chip">{cart.items.length}</span>
            <span className="total"> ${cart.total?.toFixed(2) ?? '0.00'}</span>
          </button>
        </div>
      </header>

      <main className="vc-main">
        {error && <div className="vc-error">{error}</div>}

        {loading ? (
          <div className="vc-loading">Loading products…</div>
        ) : (
          <div className="vc-grid">
            <Products products={products} onAdd={handleAdd} />
            <Cart items={cart.items || []} onRemove={handleRemove} />
          </div>
        )}
      </main>

    {showCheckout && (
  <CheckoutModal
    onClose={() => setShowCheckout(false)}
    onSubmit={handleCheckout}
    cartTotalUSD={cart.total ?? 0}
  />
)}

      {receipt && (
        <div className="receipt-modal">
          <h3>Receipt</h3>
          <p><strong>Total:</strong> ${receipt.total}</p>
          <p><strong>Time:</strong> {new Date(receipt.timestamp).toLocaleString()}</p>
          {receipt.name && <p><strong>Name:</strong> {receipt.name}</p>}
          {receipt.email && <p><strong>Email:</strong> {receipt.email}</p>}
          <div style={{ textAlign: 'right' }}>
            <button className="btn" onClick={() => setReceipt(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
