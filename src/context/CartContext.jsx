import { createContext, useContext, useState } from 'react';
import { toBase, calcPrice } from '../utils/units';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product, orderedQty, orderedUnit) {
    const baseQty = toBase(orderedQty, orderedUnit);
    const lineTotal = calcPrice(orderedQty, orderedUnit, product.pricePerBase);

    const existing = items.find(
      i => i.productId === product.id && i.orderedUnit === orderedUnit
    );

    if (existing) {
      setItems(items.map(i =>
        i.productId === product.id && i.orderedUnit === orderedUnit
          ? {
              ...i,
              orderedQty: i.orderedQty + orderedQty,
              baseQty: i.baseQty + baseQty,
              lineTotal: i.lineTotal + lineTotal,
            }
          : i
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        orderedQty,
        orderedUnit,
        baseUnit: product.baseUnit,
        baseQty,
        pricePerBase: product.pricePerBase,
        lineTotal,
      }]);
    }
  }

  function removeItem(productId, orderedUnit) {
    setItems(items.filter(i => !(i.productId === productId && i.orderedUnit === orderedUnit)));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.lineTotal, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
