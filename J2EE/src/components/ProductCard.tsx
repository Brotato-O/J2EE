import React from 'react';
import type { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const handleAddToCart = () => {
    alert(`Đã thêm ${product.name} vào giỏ hàng!`);
  };

  return (
    <div style={{ 
      border: '1px solid #ddd', 
      borderRadius: '12px', 
      padding: '15px', 
      display: 'flex', 
      flexDirection: 'column',
      gap: '10px',
      backgroundColor: '#fff',
      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
    }}>
      <img 
        src={product.imageUrl} 
        alt={product.name} 
        style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '8px' }} 
      />
      <h3 style={{ margin: '10px 0 5px 0', fontSize: '1.2rem' }}>{product.name}</h3>
      <p style={{ color: '#666', fontSize: '0.9rem', flexGrow: 1 }}>{product.shortDescription}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: 'bold', color: '#e44d26', fontSize: '1.1rem' }}>
          {product.price.toLocaleString('vi-VN')} đ
        </span>
        <span style={{ fontSize: '0.8rem', color: '#888' }}>Kho: {product.inStock}</span>
      </div>
      <button 
        onClick={handleAddToCart}
        style={{
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          padding: '10px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '500',
          transition: 'background 0.2s'
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#0056b3')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#007bff')}
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;
