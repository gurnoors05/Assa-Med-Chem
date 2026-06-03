import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// Hardcoded demo users
const USERS = [
  { id: 'admin1', username: 'admin',   password: 'admin123',  role: 'admin',  name: 'Dr. Radhika Nair' },
  { id: 'user1',  username: 'priya',   password: 'user123',   role: 'seller', name: 'Priya Sharma' },
  { id: 'user2',  username: 'arjun',   password: 'user123',   role: 'seller', name: 'Arjun Mehta' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState({ id: 'admin1', username: 'admin', role: 'admin', name: 'Dr. Radhika' });
  const [error, setError] = useState('');

  function login(username, password) {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      setUser(found);
      setError('');
      return true;
    } else {
      setError('Invalid credentials. Try admin/admin123 or priya/user123');
      return false;
    }
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, error, setError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
