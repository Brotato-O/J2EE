import React from 'react';
import { FiArrowRight, FiMinus, FiPlus, FiShoppingBag, FiTrash2 } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import styles from './CartPage.module.css';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.info('Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }
    navigate('/checkout');
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Giỏ hàng</h1>

      {cart.length === 0 ? (
        <div className={styles.empty}>
          <FiShoppingBag className={styles.emptyIcon} aria-hidden="true" />
          <h2>Giỏ hàng đang trống</h2>
          <p className={styles.emptyText}>Hãy khám phá và thêm sản phẩm bạn yêu thích.</p>
          <Link className={styles.shopButton} to="/products">Quay lại mua sắm</Link>
        </div>
      ) : (
        <div className={styles.content}>
          <section className={styles.items} aria-label="Sản phẩm trong giỏ hàng">
            {cart.map((item) => (
              <article key={item.id} className={styles.item}>
                <img className={styles.image} src={item.imageUrl} alt={item.name} />
                <div className={styles.details}>
                  <h2 className={styles.name}>{item.name}</h2>
                  <p className={styles.price}>
                  {item.price.toLocaleString('vi-VN')} đ
                  </p>
                  <div className={styles.quantity} aria-label={`Số lượng ${item.name}`}>
                    <button className={styles.quantityButton} type="button" aria-label="Giảm số lượng" onClick={() => updateQuantity(item.id, item.quantity - 1)}><FiMinus /></button>
                    <span className={styles.quantityValue}>{item.quantity}</span>
                    <button className={styles.quantityButton} type="button" aria-label="Tăng số lượng" onClick={() => updateQuantity(item.id, item.quantity + 1)}><FiPlus /></button>
                  </div>
                </div>
                <button className={styles.removeButton} type="button" aria-label={`Xóa ${item.name}`} onClick={() => removeFromCart(item.id)}><FiTrash2 /></button>
              </article>
            ))}
          </section>
          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>
            <div className={styles.summaryRow}><span>Tạm tính ({totalItems} sản phẩm)</span><strong>{totalPrice.toLocaleString('vi-VN')} đ</strong></div>
            <div className={styles.totalRow}><span>Tổng cộng</span><span>{totalPrice.toLocaleString('vi-VN')} đ</span></div>
            <button className={styles.checkoutButton} type="button" onClick={handleCheckout}>Tiến hành thanh toán <FiArrowRight /></button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;