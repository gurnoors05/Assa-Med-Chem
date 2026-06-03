import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { compatibleUnits, fromBase, calcPrice, formatINR, UNIT_LABELS, toBase } from '../utils/units';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const units = compatibleUnits(product.baseUnit);
  const [selectedUnit, setSelectedUnit] = useState(units[0]);
  const [qty, setQty] = useState('');
  const [added, setAdded] = useState(false);

  const parsedQty = parseFloat(qty);
  const validQty = !isNaN(parsedQty) && parsedQty > 0;
  const lineTotal = validQty ? calcPrice(parsedQty, selectedUnit, product.pricePerBase) : null;

  // Stock in display unit
  const stockDisplay = fromBase(product.stockBase, units[0]);

  // Price per selected unit
  const pricePerUnit = (product.pricePerBase * (selectedUnit === 'kg' ? 1000 : selectedUnit === 'L' ? 1000 : 1));

  function handleAdd() {
    if (!validQty) return;
    addItem(product, parsedQty, selectedUnit);
    setQty('');
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="product-card">
      <div className="product-card-header">
        <div>
          <span className="product-sku">{product.sku}</span>
          <span className="product-category">{product.category}</span>
        </div>
        <div className={`stock-dot ${product.stockBase > 0 ? 'in-stock' : 'out-stock'}`} />
      </div>

      <h3 className="product-name">{product.name}</h3>
      <p className="product-desc">{product.description}</p>

      <div className="product-meta">
        <div className="meta-row">
          <span>Stock</span>
          <strong>{stockDisplay.toLocaleString('en-IN')} {UNIT_LABELS[units[0]]}</strong>
        </div>
        <div className="meta-row">
          <span>Rate</span>
          <strong>
            {formatINR(product.pricePerBase)} / {UNIT_LABELS[product.baseUnit]}
          </strong>
        </div>
        {units.length > 1 && (
          <div className="meta-row secondary">
            <span></span>
            <span>
              ≈ {formatINR(product.pricePerBase * toBase(1, units[1]))} / {UNIT_LABELS[units[1]]}
            </span>
          </div>
        )}
      </div>

      <div className="order-row">
        <input
          className="qty-input"
          type="number"
          min="0"
          step="any"
          value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="Qty"
        />
        <select
          className="unit-select"
          value={selectedUnit}
          onChange={e => setSelectedUnit(e.target.value)}
        >
          {units.map(u => (
            <option key={u} value={u}>{UNIT_LABELS[u]}</option>
          ))}
        </select>
        <button
          className={`btn-add ${added ? 'added' : ''}`}
          onClick={handleAdd}
          disabled={!validQty}
        >
          {added ? '✓' : '+'}
        </button>
      </div>

      {validQty && lineTotal !== null && (
        <div className="price-preview">
          {parsedQty} {selectedUnit} → <strong>{formatINR(lineTotal)}</strong>
        </div>
      )}
    </div>
  );
}
