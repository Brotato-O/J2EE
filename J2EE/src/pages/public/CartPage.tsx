
import React from 'react';
import {
  FiArrowRight,
  FiMinus,
  FiPlus,
  FiShoppingBag,
  FiTrash2
} from 'react-icons/fi';

import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';
import styles from './CartPage.module.css';

const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    totalItems,
    totalPrice
  } = useCart();

  const navigate = useNavigate();

  // Định dạng tiền
  const formatPrice = (price: number | string | undefined | null) => {
    return Number(price ?? 0).toLocaleString('vi-VN') + ' đ';
  };

  // Thanh toán
  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.info('Vui lòng thêm sản phẩm trước khi thanh toán.');
      return;
    }

    navigate('/checkout');
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = async (
    itemId: number,
    quantity: number
  ) => {
    try {
      if (quantity < 1) return;

      await updateQuantity(itemId, quantity);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể cập nhật số lượng'
      );
    }
  };

  // Xóa sản phẩm
  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể xóa sản phẩm'
      );
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heading}>Giỏ hàng</h1>

      {cart.length === 0 ? (
        <div className={styles.empty}>
          <FiShoppingBag
            className={styles.emptyIcon}
            aria-hidden="true"
          />

          <h2>Giỏ hàng đang trống</h2>

          <p className={styles.emptyText}>
            Hãy khám phá và thêm sản phẩm bạn yêu thích.
          </p>

          <Link
            className={styles.shopButton}
            to="/products"
          >
            Quay lại mua sắm
          </Link>
        </div>
      ) : (
        <div className={styles.content}>
          <section
            className={styles.items}
            aria-label="Sản phẩm trong giỏ hàng"
          >
            {cart.map((item) => (
              <article
                key={item.id}
                className={styles.item}
              >
                <img
                  className={styles.image}
                  src={item.image}
                  alt={item.productName}
                />

                <div className={styles.details}>
                  <h2 className={styles.name}>
                    {item.productName}
                  </h2>

                  <p className={styles.price}>
                    {formatPrice(item.unitPrice)}
                  </p>

                  <p>
                    SKU: {item.sku}
                  </p>

                  <p>
                    Màu sắc: {item.color} | Size: {item.size}
                  </p>

                  <div
                    className={styles.quantity}
                    aria-label={`Số lượng ${item.productName}`}
                  >
                    <button
                      className={styles.quantityButton}
                      type="button"
                      aria-label="Giảm số lượng"
                      disabled={item.quantity <= 1}
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity - 1
                        )
                      }
                    >
                      <FiMinus />
                    </button>

                    <span className={styles.quantityValue}>
                      {item.quantity}
                    </span>

                    <button
                      className={styles.quantityButton}
                      type="button"
                      aria-label="Tăng số lượng"
                      disabled={
                        item.quantity >= item.availableStock
                      }
                      onClick={() =>
                        handleUpdateQuantity(
                          item.id,
                          item.quantity + 1
                        )
                      }
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <p>
                    Thành tiền: <strong>
                      {formatPrice(item.totalPrice)}
                    </strong>
                  </p>
                </div>

                <button
                  className={styles.removeButton}
                  type="button"
                  aria-label={`Xóa ${item.productName}`}
                  onClick={() => handleRemove(item.id)}
                >
                  <FiTrash2 />
                </button>
              </article>
            ))}
          </section>

          <aside className={styles.summary}>
            <h2 className={styles.summaryTitle}>
              Tóm tắt đơn hàng
            </h2>

            <div className={styles.summaryRow}>
              <span>
                Tạm tính ({totalItems} sản phẩm)
              </span>

              <strong>
                {formatPrice(totalPrice)}
              </strong>
            </div>

            <div className={styles.totalRow}>
              <span>Tổng cộng</span>

              <span>
                {formatPrice(totalPrice)}
              </span>
            </div>

            <button
              className={styles.checkoutButton}
              type="button"
              onClick={handleCheckout}
            >
              Tiến hành thanh toán
              <FiArrowRight />
            </button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default CartPage;
