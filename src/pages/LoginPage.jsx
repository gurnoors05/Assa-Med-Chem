import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, error, setError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login(username, password);
      setLoading(false);
    }, 400);
  }

  function fillDemo(role) {
    setError('');
    if (role === 'admin') { setUsername('admin'); setPassword('admin123'); }
    else { setUsername('priya'); setPassword('user123'); }
  }

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">
          <span className="brand-icon">⬡</span>
          <span className="brand-name">AasaMedChem</span>
        </div>
        <div className="login-tagline">
          <h1>Laboratory<br />Inventory &<br />Order System</h1>
          <p>Precision-grade reagent procurement for modern research facilities.</p>
        </div>
        <div className="login-badges">
          <span className="badge">ISO 9001</span>
          <span className="badge">GMP Certified</span>
          <span className="badge">NABL Approved</span>
        </div>
      </div>

      <div className="login-right">
        <div className="login-card">
          <h2>Sign In</h2>
          <p className="login-sub">Access your procurement dashboard</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Username</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div className="field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            <button className="btn-primary full" type="submit" disabled={loading}>
              {loading ? 'Authenticating…' : 'Sign In →'}
            </button>
          </form>

          <div className="demo-section">
            <span>Quick demo access:</span>
            <div className="demo-btns">
              <button className="btn-demo" onClick={() => fillDemo('admin')}>
                👤 Admin
              </button>
              <button className="btn-demo" onClick={() => fillDemo('user')}>
                🧪 Seller
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
