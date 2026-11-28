import type { OrderResponse } from "../../../types/Order";

interface Props {
  order?: OrderResponse;
}

function OrderShippingPayment({ order }: Props) {
  const isDelivered = order?.status?.toUpperCase() === "DELIVERED";

  return (
    <div className="info-grid">
      <div className="detail-card">
        <h3 className="sub-title">Địa chỉ nhận hàng</h3>
        <div className="info-content">
          <strong>{order?.customerName || "Khách hàng"}</strong>
          <p style={{ marginTop: "4px", color: "#374151" }}>
            {order?.address || "Chưa có thông tin địa chỉ"}
          </p>
        </div>
      </div>

      <div className="detail-card">
        <h3 className="sub-title">Hình thức thanh toán</h3>
        <div className="info-content">
          <p>
            <strong>Thanh toán khi nhận hàng (COD)</strong>
          </p>
          <p className="text-muted">
            Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận hàng.
          </p>
          <span className={`payment-status-tag ${isDelivered ? "success" : "pending"}`}>
            {isDelivered ? "Đã thanh toán" : "Chưa thanh toán"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderShippingPayment;
