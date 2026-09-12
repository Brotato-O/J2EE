import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout: React.FC = () => {
  return (
    <div>
      <header style={{ background: '#f0f0f0', padding: '10px', borderBottom: '1px solid #ccc' }}>
        <h1>E-commerce Public Header</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', gap: '15px' }}>
            <li><a href="/">Home</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/cart">Cart</a></li>
            <li><a href="/login">Login</a></li>
            <li><a href="/register">Register</a></li>
          </ul>
        </nav>
      </header>
      <main style={{ padding: '20px' }}>
        <Outlet />
      </main>
      <footer style={{ background: '#f0f0f0', padding: '10px', borderTop: '1px solid #ccc', textAlign: 'center' }}>
        <p>&copy; 2026 E-commerce Public Site</p>
      </footer>
    </div>
  );
};

export default PublicLayout;