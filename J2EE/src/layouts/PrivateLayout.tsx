import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../components/Auth/AuthContext';

const PrivateLayout: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <header style={{ background: '#e0e0e0', padding: '10px', borderBottom: '1px solid #ccc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>E-commerce Private Header</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px', alignItems: 'center' }}>
            <li><a href="/checkout">Checkout</a></li>
            <li><a href="/order-history">Order History</a></li>
            <li><a href="/profile">Profile</a></li>
            {user && <li><span>Welcome, {user.name || user.username}</span></li>}
            <li><button onClick={logout}>Logout</button></li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
      <footer style={{ background: '#e0e0e0', padding: '10px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p>&copy; 2026 E-commerce Private Site</p>
      </footer>
    </div>
  );
};

export default PrivateLayout;