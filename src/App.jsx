import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import LoginPage from './pages/LoginPage';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import MyOrdersPage from './pages/MyOrdersPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import Navbar from './components/Navbar';

function AppInner() {
  const { user } = useAuth();
  const [page, setPage] = useState('products');


  function renderPage() {
    switch (page) {
      case 'products':     return <ProductsPage />;
      case 'cart':         return <CartPage setPage={setPage} />;
      case 'my-orders':    return <MyOrdersPage setPage={setPage} />;
      case 'admin-orders': return <AdminOrdersPage />;
      default:             return <ProductsPage />;
    }
  }

  return (
    <div className="app-shell">
      <Navbar page={page} setPage={setPage} />
      <main className="app-main">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppInner />
      </CartProvider>
    </AuthProvider>
  );
}
