import React from 'react';
import { mockProducts } from '../data/mockProducts';
import ProductCard from './ProductCard';

const ProductList: React.FC = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ marginBottom: '20px', borderBottom: '2px solid #333', paddingBottom: '10px' }}>
        Danh sách sản phẩm
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '25px'
      }}>
        {mockProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
