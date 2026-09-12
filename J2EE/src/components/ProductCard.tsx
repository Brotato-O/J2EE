import React from 'react';
import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiShoppingCart } from 'react-icons/fi';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      navigate('/login');
      return;
    }

    addToCart(product);
    toast.success('Thêm thành công');
  };

  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={product.imageUrl}
        alt={product.name}
      />
      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.description}>{product.shortDescription}</p>
      <div className={styles.meta}>
        <span className={styles.price}>
          {product.price.toLocaleString('vi-VN')} đ
        </span>
        <span className={styles.stock}>Kho: {product.inStock}</span>
      </div>
      <button
        className={styles.button}
        type="button"
        onClick={handleAddToCart}
      >
        <FiShoppingCart aria-hidden="true" />{' '}
        Thêm vào giỏ hàng
      </button>
    </article>
  );
};

export default ProductCard;
