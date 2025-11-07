import React, { useState } from 'react';
import { IconAdd } from '../icons';

export default function Products({ products = [], onAdd }) {
  const [addingId, setAddingId] = useState(null);

  async function handleAdd(id) {
    try {
      setAddingId(id);
      await onAdd(id);
    } finally {
      setAddingId(null);
    }
  }

  if (!products.length) return <div className="empty">No products available</div>;

  return (
    <section className="products">
      {products.map(p => (
        <article key={p.id} className="product-card lift">
          <div className="product-media">
            <div className="img-placeholder">📦</div>
          </div>
          <div className="product-body">
            <h4 className="product-title">{p.name}</h4>
            <div className="product-meta">
              <div className="price">${p.price.toFixed(2)}</div>
              <button
                className="btn small"
                onClick={() => handleAdd(p.id)}
                disabled={addingId === p.id}
                aria-label={`Add ${p.name} to cart`}
              >
                <IconAdd style={{ marginRight: 6 }} />
                {addingId === p.id ? 'Adding…' : 'Add'}
              </button>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
