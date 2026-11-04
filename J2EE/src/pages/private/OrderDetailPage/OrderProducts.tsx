
import type { OrderResponse } from "../../../types/Order";

interface Props {
  order: OrderResponse;
}

function OrderProducts({ order }: Props) {
  const formatPrice = (price: number) =>
    price.toLocaleString("vi-VN") + " đ";

  return (
    <div className="detail-card">
      <h2 className="card-title">Sản phẩm đã đặt</h2>

      <div className="products-list">
        {order.items.map((item) => (
          <div className="product-row" key={item.orderDetailId}>
            <div className="product-thumb">
              <span>{item.productName.charAt(0)}</span>
            </div>

            <div className="product-details">
              <span className="product-title">
                {item.productName}
              </span>

              <span className="product-variant">
                Màu: {item.colorName} / Size: {item.sizeName}
              </span>

              <span className="product-qty-text">
                Số lượng: {item.quantity}
              </span>
            </div>

            <span className="product-price-text">
              {formatPrice(item.totalPrice)}
            </span>
          </div>
        ))}
      </div>

      <div className="price-summary-section">
        <div className="summary-line">
          <span>Tạm tính</span>
          <span>{formatPrice(order.totalPrice)}</span>
        </div>

        <div className="summary-line">
          <span>Phí vận chuyển</span>
          <span className="free-text">Miễn phí</span>
        </div>

        <div className="summary-line">
          <span>Giảm giá Voucher</span>
          <span>-0 đ</span>
        </div>

        <div className="summary-line total-line">
          <span>Tổng thành tiền</span>
          <span className="final-price">
            {formatPrice(order.totalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderProducts;
