
import { useEffect, useState } from "react";
import { getMyCart } from "../../../api/cartApi";
import type { CartResponse } from "../../../types/Cart";

interface OrderSummaryProps {
  address: string;
  isAddressValid?: boolean;
  onPlaceOrder: () => void;
  isSubmitting: boolean;
}

function OrderSummary({
  address,
  isAddressValid,
  onPlaceOrder,
  isSubmitting,
}: OrderSummaryProps) {
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getMyCart();
        setCart(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải giỏ hàng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const formatPrice = (price: number) => {
    return price.toLocaleString("vi-VN") + " đ";
  };

  if (loading) {
    return (
      <div className="checkout-card summary-card">
        Đang tải thông tin đơn hàng...
      </div>
    );
  }

  if (error) {
    return (
      <div className="checkout-card summary-card">
        <p>{error}</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="checkout-card summary-card">
        <h2 className="card-title">Đơn hàng</h2>
        <p>Giỏ hàng của bạn đang trống.</p>
      </div>
    );
  }

  return (
    <div className="checkout-card summary-card">
      <h2 className="card-title">
        Đơn hàng ({cart.totalQuantity} sản phẩm)
      </h2>

      {/* Danh sách sản phẩm */}
      {cart.items.map((item) => (
        <div className="order-item" key={item.id}>
          <div className="item-img-placeholder">
            <img
              src={item.image || "https://via.placeholder.com/60"}
              alt={item.productName}
            />
          </div>

          <div className="item-details">
            <span className="item-name">
              {item.productName}
            </span>

            <span className="item-qty">
              Màu: {item.color} | Size: {item.size}
            </span>

            <span className="item-qty">
              Số lượng: {item.quantity}
            </span>

            <span className="item-qty">
              Đơn giá: {formatPrice(item.unitPrice)}
            </span>
          </div>

          <span className="item-price">
            {formatPrice(item.totalPrice)}
          </span>
        </div>
      ))}

      <div className="divider"></div>

      {/* Chi tiết thanh toán */}
      <div className="summary-row">
        <span>Tạm tính</span>
        <span>{formatPrice(cart.totalPrice)}</span>
      </div>

      <div className="summary-row">
        <span>Phí vận chuyển</span>
        <span className="free-text">Miễn phí</span>
      </div>

      <div className="divider"></div>

      <div className="summary-row total-row">
        <span>Tổng cộng</span>
        <span className="total-price">
          {formatPrice(cart.totalPrice)}
        </span>
      </div>

      <button
        className="btn-submit-order"
        onClick={onPlaceOrder}
        disabled={
          (isAddressValid !== undefined ? !isAddressValid : !address.trim()) ||
          isSubmitting ||
          !cart?.items.length
        }
      >
        {isSubmitting ? "Đang đặt hàng..." : "Đặt hàng ngay"}
      </button>

      {(isAddressValid !== undefined ? !isAddressValid : !address.trim()) && (
        <p className="error-message">
          Vui lòng nhập đầy đủ địa chỉ giao hàng.
        </p>
      )}
    </div>
  );
}

export default OrderSummary;
