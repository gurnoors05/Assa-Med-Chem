import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../data/mockData';
import { formatINR, UNIT_LABELS } from '../utils/units';

const STATUS_COLORS = {
  pending:  'status-badge pending',
  approved: 'status-badge approved',
  rejected: 'status-badge rejected',
  shipped:  'status-badge shipped',
};

export default function MyOrdersPage({ setPage }) {
  const { user } = useAuth();
  const allOrders = getOrders();
  const orders = allOrders.filter(o => o.userId === user.id);
  const [expanded, setExpanded] = useState(null);

  if (orders.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No orders yet</h3>
          <p>Once you place a quotation, it will appear here.</p>
          <button className="btn-primary" onClick={() => setPage('products')}>Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>My Orders</h2>
          <p>{orders.length} quotation{orders.length !== 1 ? 's' : ''} submitted</p>
        </div>
      </div>

      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div className="order-id-block">
                <span className="order-id">{order.id}</span>
                <span className={STATUS_COLORS[order.status] || 'status-badge pending'}>
                  {order.status}
                </span>
              </div>
              <div className="order-meta-row">
                <span>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                <strong>{formatINR(order.total)}</strong>
              </div>
              <span className="expand-icon">{expanded === order.id ? '▲' : '▼'}</span>
            </div>

            {expanded === order.id && (
              <div className="order-detail">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Ordered</th>
                      <th>Base Qty</th>
                      <th>Rate</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item, i) => (
                      <tr key={i}>
                        <td>
                          <div className="table-product">
                            <strong>{item.productName}</strong>
                            <span className="sku-label">{item.sku}</span>
                          </div>
                        </td>
                        <td className="num-cell">{item.orderedQty} {UNIT_LABELS[item.orderedUnit]}</td>
                        <td className="num-cell dim">{item.baseQty.toLocaleString('en-IN')} {UNIT_LABELS[item.baseUnit]}</td>
                        <td className="num-cell">{formatINR(item.pricePerBase)}/{UNIT_LABELS[item.baseUnit]}</td>
                        <td className="num-cell">{formatINR(item.lineTotal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {order.notes && (
                  <div className="order-notes">
                    <strong>Notes:</strong> {order.notes}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
