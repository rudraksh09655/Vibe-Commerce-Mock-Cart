// frontend/src/components/CheckoutModal.js
import React, { useState, useEffect } from 'react';
import { formatUSD, formatINR, USD_TO_INR } from '../utils/currency';

export default function CheckoutModal({ onClose, onSubmit, cartTotalUSD = 0 }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [currency, setCurrency] = useState('USD'); // 'USD' or 'INR'

  useEffect(() => {
    // reset error when currency changes
    setLocalError(null);
  }, [currency]);

  function displayedTotal() {
    if (currency === 'INR') return formatINR(cartTotalUSD);
    return formatUSD(cartTotalUSD);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);

    if (!name.trim() || !email.trim()) {
      setLocalError('Please enter name and email.');
      return;
    }

    setLoading(true);
    try {
      // onSubmit receives the form data + currency preference
      await onSubmit({ name: name.trim(), email: email.trim(), currency });
      // parent will close modal and show receipt
    } catch (err) {
      setLocalError(err.message || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <form className="modal-card" onSubmit={handleSubmit}>
        <h3>Checkout</h3>

        {localError && <div className="vc-error small">{localError}</div>}

        <div style={{ marginBottom: 8 }}>
          <label style={{ marginRight: 8 }}>
            <input
              type="radio"
              name="currency"
              value="USD"
              checked={currency === 'USD'}
              onChange={() => setCurrency('USD')}
            />{' '}
            Pay in USD ({formatUSD(cartTotalUSD)})
          </label>

          <label style={{ marginLeft: 12 }}>
            <input
              type="radio"
              name="currency"
              value="INR"
              checked={currency === 'INR'}
              onChange={() => setCurrency('INR')}
            />{' '}
            Pay in INR ({formatINR(cartTotalUSD)})
          </label>
        </div>

        <label className="field">
          <div className="label">Name</div>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
        </label>

        <label className="field">
          <div className="label">Email</div>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" type="email" required />
        </label>

        <div style={{ marginTop: 8, marginBottom: 8 }}>
          <strong>Amount:</strong> {displayedTotal()}
          {currency === 'INR' && (
            <div style={{ fontSize: 12, color: '#666' }}>
              (Conversion rate: 1 USD = {USD_TO_INR} INR)
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Processing…' : 'Confirm Order'}
          </button>
          <button className="btn ghost" type="button" onClick={onClose} disabled={loading}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
