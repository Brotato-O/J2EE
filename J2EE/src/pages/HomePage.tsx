import React from 'react';
import ProductList from '../components/ProductList';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <header style={{ 
        backgroundColor: '#333', 
        color: 'white', 
        padding: '40px 20px', 
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1>Chào mừng đến với J2EE Store</h1>
        <p>Khám phá danh sách sản phẩm mới nhất của chúng tôi</p>
      </header>
      <main>
        <ProductList />
      </main>
    </div>
  );
};

export default HomePage;
