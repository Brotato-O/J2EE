import type { OrderResponse } from "../../../types/Order";

interface Props {
  order: OrderResponse;
}

const steps = [
  { status: "NEW", aliases: ["NEW", "PENDING"], label: "Đã đặt hàng" },
  { status: "CONFIRMED", aliases: ["CONFIRMED"], label: "Đã xác nhận" },
  { status: "PACKING", aliases: ["PACKING", "PROCESSING"], label: "Đang đóng gói" },
  { status: "SHIPPING", aliases: ["SHIPPING", "SHIPPED"], label: "Đang giao hàng" },
  { status: "DELIVERED", aliases: ["DELIVERED", "COMPLETED"], label: "Đã giao hàng" },
];

function OrderTimeline({ order }: Props) {
  const currentStatus = order?.status?.toUpperCase() || "";

  // Trường hợp đơn đã hủy
  if (currentStatus === "CANCELLED" || currentStatus === "CANCELED") {
    return (
      <div className="detail-card timeline-card" style={{ borderLeft: "4px solid #ef4444" }}>
        <h2 className="card-title" style={{ color: "#ef4444", marginBottom: "8px" }}>
          ❌ Đơn hàng đã hủy
        </h2>
        <p className="text-muted" style={{ margin: 0 }}>
          Đơn hàng #{order.orderId} đã được hủy vào ngày{" "}
          {order.orderDate ? new Date(order.orderDate).toLocaleDateString("vi-VN") : ""}.
        </p>
      </div>
    );
  }

  const statusOrder = steps.findIndex((step) =>
    step.aliases.includes(currentStatus)
  );

  const currentStep = statusOrder >= 0 ? statusOrder : 0;
  const orderDate = order.orderDate
    ? new Date(order.orderDate).toLocaleString("vi-VN")
    : "--";

  return (
    <div className="detail-card timeline-card">
      <h2 className="card-title">Trạng thái đơn hàng</h2>

      <div className="stepper-wrapper">
        {steps.map((step, index) => {
          const completed = currentStep >= index;
          const active = currentStep === index;

          return (
            <div
              className={`stepper-item ${completed ? "completed" : ""} ${
                active ? "active" : ""
              }`}
              key={step.status}
            >
              <div className="step-counter">{completed ? "✓" : index + 1}</div>

              <div className="step-name">{step.label}</div>

              <div className="step-time">{index === 0 ? orderDate : "--"}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default OrderTimeline;
