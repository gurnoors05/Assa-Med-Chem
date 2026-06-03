import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar({ page, setPage }) {
  const { user, logout } = useAuth();
  const { items } = useCart();

  const isAdmin = user?.role === 'admin';

  const navItems = isAdmin
    ? [
        { id: 'products', label: 'Products' },
        { id: 'admin-orders', label: 'Orders' },
      ]
    : [
        { id: 'products', label: 'Browse Products' },
        { id: 'my-orders', label: 'My Orders' },
      ];

  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage('products')}>
        <span className="brand-icon-sm">⬡</span>
        <span>AasaMedChem</span>
      </div>

      <div className="nav-links">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-link ${page === item.id ? 'active' : ''}`}
            onClick={() => setPage(item.id)}
          >
            {item.label}
          </button>
        ))}

        {!isAdmin && (
          <button
            className={`nav-link cart-btn ${page === 'cart' ? 'active' : ''}`}
            onClick={() => setPage('cart')}
          >
            Cart
            {items.length > 0 && (
              <span className="cart-badge">{items.length}</span>
            )}
          </button>
        )}
      </div>

      <div className="nav-user">
        <div className="user-pill">
          <span className="user-role-tag">{isAdmin ? 'Admin' : 'Seller'}</span>
          <span className="user-name">{user?.name}</span>
        </div>
        <button className="btn-logout" onClick={logout}>Sign Out</button>
      </div>
    </nav>
  );
}
