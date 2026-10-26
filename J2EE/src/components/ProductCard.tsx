
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
  const [addingToCart, setAddingToCart] = useState(false);

  const isOutOfStock = product.inStock <= 0;

  // XEM CHI TIẾT
  const handleViewDetail = () => {
    navigate(`/product/${product.id}`);
  };

  // THÊM VÀO GIỎ HÀNG
  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      navigate('/login');
      return;
    }

    if (isOutOfStock) {
      toast.warning('Sản phẩm đã hết hàng.');
      return;
    }

    try {
      setAddingToCart(true);

      await addToCart(product);

      toast.success('Thêm sản phẩm vào giỏ hàng thành công!');
    } catch (error) {
      console.error('Lỗi thêm giỏ hàng:', error);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng.');
    } finally {
      setAddingToCart(false);
    }
  };

  // YÊU THÍCH
  const handleToggleWishlist = () => {
    if (!isAuthenticated) {
      toast.info('Vui lòng đăng nhập để sử dụng danh sách yêu thích.');
      navigate('/login');
      return;
    }

    setIsWishlisted((previous) => {
      const next = !previous;

      toast.success(
        next
          ? 'Đã thêm vào danh sách yêu thích'
          : 'Đã xóa khỏi danh sách yêu thích'
      );

      return next;
    });
  };

  return (
    <article className={styles.card}>
      {/* HÌNH ẢNH */}
      <div className={styles.imageWrapper}>
        <img
          className={styles.image}
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          loading="lazy"
          onClick={handleViewDetail}
          style={{ cursor: 'pointer' }}
        />

        <button
          type="button"
          className={styles.wishlistBtn}
          onClick={handleToggleWishlist}
          title={
            isWishlisted
              ? 'Xóa khỏi yêu thích'
              : 'Thêm vào yêu thích'
          }
        >
          {isWishlisted
            ? <FaHeart color="#f04d26" />
            : <FiHeart />}
        </button>
      </div>

      {/* TÊN SẢN PHẨM */}
      <h3
        className={styles.name}
        onClick={handleViewDetail}
        style={{ cursor: 'pointer' }}
      >
        {product.name}
      </h3>

      {/* MÔ TẢ */}
      <p className={styles.description}>
        {product.shortDescription || 'Chưa có mô tả'}
      </p>

      {/* GIÁ VÀ TỒN KHO */}
      <div className={styles.meta}>
        <span className={styles.price}>
          {product.price.toLocaleString('vi-VN')} đ
        </span>

        <span className={styles.stock}>
          {isOutOfStock
            ? 'Hết hàng'
            : `Kho: ${product.inStock}`}
        </span>
      </div>

      {/* XEM CHI TIẾT */}
      <button
        className={styles.detailButton}
        type="button"
        onClick={handleViewDetail}
      >
        <FiEye aria-hidden="true" />
        Xem chi tiết
      </button>

      {/* THÊM GIỎ HÀNG */}
      <button
        className={styles.button}
        type="button"
        onClick={handleAddToCart}
        disabled={isOutOfStock || addingToCart}
      >
        <FiShoppingCart aria-hidden="true" />

        {addingToCart
          ? 'Đang thêm...'
          : isOutOfStock
            ? 'Hết hàng'
            : 'Thêm vào giỏ hàng'}
      </button>
    </article>
  );
};

export default ProductCard;
