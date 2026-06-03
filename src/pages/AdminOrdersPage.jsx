import { useState } from 'react';
import { getOrders, updateOrderStatus } from '../data/mockData';
import { formatINR, UNIT_LABELS } from '../utils/units';

const STATUS_OPTIONS = ['pending', 'approved', 'rejected', 'shipped'];

const STATUS_COLORS = {
  pending:  'status-badge pending',
  approved: 'status-badge approved',
  rejected: 'status-badge rejected',
  shipped:  'status-badge shipped',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState(() => getOrders());
  const [expanded, setExpanded] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  function handleStatusChange(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus);
    setOrders(getOrders());
  }

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    approved: orders.filter(o => o.status === 'approved').length,
    value: orders.reduce((s, o) => s + o.total, 0),
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h2>Order Management</h2>
          <p>Review and process incoming quotations</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <strong className="stat-value">{stats.total}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Pending</span>
          <strong className="stat-value pending">{stats.pending}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Approved</span>
          <strong className="stat-value approved">{stats.approved}</strong>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Value (INR)</span>
          <strong className="stat-value">{formatINR(stats.value)}</strong>
        </div>
      </div>

      {/* Filter */}
      <div className="filters-bar">
        <div className="category-pills">
          {['all', ...STATUS_OPTIONS].map(s => (
            <button
              key={s}
              className={`pill ${filterStatus === s ? 'active' : ''}`}
              onClick={() => setFilterStatus(s)}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No orders in this status</h3>
        </div>
      )}

      <div className="orders-list">
        {filtered.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-card-header" onClick={() => setExpanded(expanded === order.id ? null : order.id)}>
              <div className="order-id-block">
                <span className="order-id">{order.id}</span>
                <span className={STATUS_COLORS[order.status] || 'status-badge pending'}>
                  {order.status}
                </span>
              </div>
              <div className="order-meta-row">
                <span><strong>From:</strong> {order.userName}</span>
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
                      <th>Product (SKU)</th>
                      <th>Ordered</th>
                      <th>Base Qty (stored)</th>
                      <th>Rate / base unit</th>
                      <th>Line Total (INR)</th>
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
                        <td className="num-cell">
                          {item.orderedQty} {UNIT_LABELS[item.orderedUnit]}
                        </td>
                        <td className="num-cell">
                          <span className="conversion-tag">
                            {item.baseQty.toLocaleString('en-IN')} {UNIT_LABELS[item.baseUnit]}
                          </span>
                        </td>
                        <td className="num-cell">
                          {formatINR(item.pricePerBase)} / {UNIT_LABELS[item.baseUnit]}
                        </td>
                        <td className="num-cell total-cell">
                          {formatINR(item.lineTotal)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {order.notes && (
                  <div className="order-notes">
                    <strong>Notes:</strong> {order.notes}
                  </div>
                )}

                <div className="order-actions">
                  <span>Update status:</span>
                  <div className="action-btns">
                    {STATUS_OPTIONS.map(s => (
                      <button
                        key={s}
                        className={`btn-status ${s} ${order.status === s ? 'current' : ''}`}
                        onClick={() => handleStatusChange(order.id, s)}
                        disabled={order.status === s}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
