import React, { useState } from 'react';
import type { Product } from '../types/Product';
import { useCart } from '../context/CartContext';
import { useAuth } from './Auth/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiShoppingCart, FiEye, FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      navigate('/login');
      return;
    }

    addToCart(product);
    toast.success('Thêm thành công');
  };

  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để sử dụng danh sách yêu thích.');
      navigate('/login');
      return;
    }

    setIsWishlisted(!isWishlisted);
    toast.success(
      !isWishlisted
        ? 'Đã thêm vào danh sách yêu thích'
        : 'Đã xóa khỏi danh sách yêu thích'
    );
  };

  const handleViewDetail = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <article className={styles.card}>
      {/* Bọc ảnh và icon Yêu thích chung một khung */}
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={product.imageUrl}
          alt={product.name}
        />
        <button
          type="button"
          className={styles.wishlistBtn}
          onClick={handleToggleWishlist}
          title={isWishlisted ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
        >
          {isWishlisted ? <FaHeart color="#f04d26" /> : <FiHeart />}
        </button>
      </div>

      <h3 className={styles.name}>{product.name}</h3>
      <p className={styles.description}>{product.shortDescription}</p>
      <div className={styles.meta}>
        <span className={styles.price}>
          {product.price.toLocaleString('vi-VN')} đ
        </span>
        <span className={styles.stock}>Kho: {product.inStock}</span>
      </div>

      {/* Nút Xem chi tiết */}
      <button
        className={styles.detailButton}
        type="button"
        onClick={handleViewDetail}
      >
        <FiEye aria-hidden="true" /> Xem chi tiết
      </button>

      <button
        className={styles.button}
        type="button"
        onClick={handleAddToCart}
      >
        <FiShoppingCart aria-hidden="true" /> Thêm vào giỏ hàng
      </button>
    </article>
  );
};

export default ProductCard;