import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { addOrder } from '../data/mockData';
import { formatINR, UNIT_LABELS } from '../utils/units';

export default function CartPage({ setPage }) {
  const { items, removeItem, clearCart, total } = useCart();
  const { user } = useAuth();
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(null);

  function handlePlaceOrder() {
    const order = addOrder({
      userId: user.id,
      userName: user.name,
      status: 'pending',
      items: items.map(i => ({ ...i })),
      total,
      notes,
    });
    clearCart();
    setSubmitted(order);
  }

  if (submitted) {
    return (
      <div className="page">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h2>Order Placed!</h2>
          <p>Your quotation <strong>{submitted.id}</strong> has been submitted for review.</p>
          <div className="success-meta">
            <div><span>Total</span><strong>{formatINR(submitted.total)}</strong></div>
            <div><span>Status</span><strong className="status-badge pending">Pending</strong></div>
          </div>
          <div className="success-actions">
            <button className="btn-primary" onClick={() => { setSubmitted(null); setPage('my-orders'); }}>
              View My Orders
            </button>
            <button className="btn-outline" onClick={() => { setSubmitted(null); setPage('products'); }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🧪</div>
          <h3>Your cart is empty</h3>
          <p>Add products from the catalogue to place an order.</p>
          <button className="btn-primary" onClick={() => setPage('products')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Order Quotation</h2>
          <p>{items.length} line item{items.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Ordered Qty</th>
                <th>Base Qty</th>
                <th>Rate (per base)</th>
                <th>Line Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td>
                    <div className="table-product">
                      <strong>{item.productName}</strong>
                      <span className="sku-label">{item.sku}</span>
                    </div>
                  </td>
                  <td className="num-cell">
                    {item.orderedQty} {UNIT_LABELS[item.orderedUnit]}
                  </td>
                  <td className="num-cell dim">
                    {item.baseQty.toLocaleString('en-IN')} {UNIT_LABELS[item.baseUnit]}
                  </td>
                  <td className="num-cell">
                    {formatINR(item.pricePerBase)}/{UNIT_LABELS[item.baseUnit]}
                  </td>
                  <td className="num-cell total-cell">
                    {formatINR(item.lineTotal)}
                  </td>
                  <td>
                    <button
                      className="btn-remove"
                      onClick={() => removeItem(item.productId, item.orderedUnit)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="conversion-note">
            <strong>💡 Conversion transparency:</strong> Quantities are stored internally in base units (g, mL, item).
            The "Base Qty" column shows exactly what will be recorded. Line totals = Base Qty × Rate per base unit.
          </div>
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          {items.map((item, i) => (
            <div key={i} className="summary-row">
              <span>{item.productName}</span>
              <span>{formatINR(item.lineTotal)}</span>
            </div>
          ))}
          <div className="summary-divider" />
          <div className="summary-total">
            <span>Grand Total (INR)</span>
            <strong>{formatINR(total)}</strong>
          </div>

          <div className="notes-field">
            <label>Notes / Instructions</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add any special requirements…"
              rows={3}
            />
          </div>

          <button className="btn-primary full" onClick={handlePlaceOrder}>
            Place Quotation
          </button>
          <button className="btn-outline full" onClick={() => setPage('products')}>
            ← Back to Products
          </button>
        </div>
      </div>
    </div>
  );
}
