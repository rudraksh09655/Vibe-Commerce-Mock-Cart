import React from 'react';
import { IconTrash } from '../icons';

export default function Cart({ items = [], onRemove }) {
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  return (
    <aside className="cart">
      <h3>Cart</h3>
      {items.length === 0 ? (
        <div className="empty">Your cart is empty</div>
      ) : (
        <>
          <ul className="cart-list">
            {items.map(it => (
              <li key={it.id} className="cart-item fade-in">
                <div className="cart-left">
                  <div className="cart-name">{it.name}</div>
                  <div className="cart-qty">Qty: {it.qty}</div>
                </div>
                <div className="cart-right">
                  <div className="cart-line">${(it.price * it.qty).toFixed(2)}</div>
                  <button className="btn small danger" onClick={() => onRemove(it.id)} aria-label={`Remove ${it.name}`}>
                    <IconTrash />
                    <span style={{ marginLeft: 6 }}>Remove</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="cart-footer">
            <div><strong>Total</strong></div>
            <div className="cart-total">${total.toFixed(2)}</div>
          </div>
        </>
      )}
    </aside>
  );
}
