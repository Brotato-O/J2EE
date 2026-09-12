import React from 'react';
import { mockProducts } from '../data/mockProducts';
import ProductCard from './ProductCard';
import styles from './ProductList.module.css';

const ProductList: React.FC = () => {
  return (
    <section>
      <h2 className={styles.heading}>
        Danh sách sản phẩm
      </h2>
      <div className={styles.list}>
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductList;
