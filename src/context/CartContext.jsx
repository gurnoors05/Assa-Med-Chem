import { createContext, useContext, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addItem(product, orderedUnit) {
    const existing = items.find(
      i => i.productId === product.id && i.orderedUnit === orderedUnit
    );

    if (existing) {
      setItems(items.map(i =>
        i.productId === product.id && i.orderedUnit === orderedUnit
          ? { ...i, orderedQty: i.orderedQty + 1 }
          : i
      ));
    } else {
      setItems([...items, {
        productId: product.id,
        productName: product.name,
        sku: product.sku,
        orderedQty: 1,
        orderedUnit,
        baseUnit: product.baseUnit,
        pricePerBase: product.pricePerBase,
      }]);
    }
  }

  function removeItem(productId, orderedUnit) {
    setItems(items.filter(i => !(i.productId === productId && i.orderedUnit === orderedUnit)));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}