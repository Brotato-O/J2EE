import React from 'react';
import ProductList from '../../components/ProductList';
import styles from './HomePage.module.css';
import Footer from '../../components/Footer';
import { mockProducts } from '../../data/mockProducts';

const HomePage: React.FC = () => {
  return (
    <div>
      <header className={styles.hero}>
        <h1 className={styles.title}>Chào mừng đến với J2EE Store</h1>
        <p className={styles.subtitle}>Khám phá danh sách sản phẩm mới nhất của chúng tôi</p>
      </header>
      <main>
        <ProductList products={mockProducts}/>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
