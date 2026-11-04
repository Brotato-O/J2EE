
import type { OrderResponse } from "../../../types/Order";

interface Props {
  order: OrderResponse;
}

const steps = [
  { status: "PENDING", label: "Đã đặt hàng" },
  { status: "CONFIRMED", label: "Đã xác nhận" },
  { status: "SHIPPING", label: "Đang giao hàng" },
  { status: "DELIVERED", label: "Đã giao hàng" },
];

function OrderTimeline({ order }: Props) {
  const statusOrder = steps.findIndex(
    (step) => step.status === order.status
  );

  const currentStep = statusOrder >= 0 ? statusOrder : -1;

  const orderDate = new Date(order.orderDate).toLocaleString("vi-VN");

  return (
    <div className="detail-card timeline-card">
      <h2 className="card-title">Trạng thái đơn hàng</h2>

      <div className="stepper-wrapper">
        {steps.map((step, index) => {
          const completed = currentStep >= index;
          const active = currentStep === index;

          return (
            <div
              className={`stepper-item ${completed ? "completed" : ""
                } ${active ? "active" : ""}`}
              key={step.status}
            >
              <div className="step-counter">
                {completed ? "✓" : index + 1}
              </div>

              <div className="step-name">
                {step.label}
              </div>

              <div className="step-time">
                {index === 0 ? orderDate : "--"}
              </div>
            </div>
          );
        })}
      </div>

      {currentStep === -1 && (
        <p className="text-muted">
          Trạng thái hiện tại: {order.status}
        </p>
      )}
    </div>
  );
}

export default OrderTimeline;
