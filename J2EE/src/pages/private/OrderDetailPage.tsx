import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./OrderDetailPage.css";
import OrderTimeline from "./OrderDetailPage/OrderTimeline";
import OrderShippingPayment from "./OrderDetailPage/OrderShippingPayment";
import OrderProducts from "./OrderDetailPage/OrderProducts";
import { getMyOrderDetailApi, type OrderResponse } from "../../api/orderApi";

interface OrderDetailPageProps {
  onBack?: () => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ onBack }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/order-history");
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Không tìm thấy mã đơn hàng");
      setLoading(false);
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMyOrderDetailApi(Number(id));
        setOrder(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Không thể tải thông tin chi tiết đơn hàng"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  return (
    <div className="detail-page">
      <main className="detail-container">
        {/* Thanh điều hướng quay lại */}
        <div className="top-navigation">
          <button className="btn-back" onClick={handleBack}>
            ← Quay lại lịch sử đơn hàng
          </button>

          {order && (
            <div className="order-head-info">
              <span>
                Mã đơn hàng: <strong>#ORD-{order.orderId}</strong>
              </span>
              <span className="divider-dot">•</span>
              <span>
                Ngày đặt:{" "}
                {order.orderDate
                  ? new Date(order.orderDate).toLocaleDateString("vi-VN")
                  : "--"}
              </span>
            </div>
          )}
        </div>

        {/* TRẠNG THÁI LOADING / ERROR */}
        {loading && (
          <div
            className="detail-card"
            style={{ textAlign: "center", padding: "40px" }}
          >
            <p>⏳ Đang tải chi tiết đơn hàng #{id}...</p>
          </div>
        )}

        {error && (
          <div
            className="detail-card"
            style={{
              textAlign: "center",
              padding: "40px",
              color: "#dc2626",
            }}
          >
            <p>⚠️ {error}</p>
            <button
              className="btn-back"
              style={{ marginTop: "12px" }}
              onClick={handleBack}
            >
              Quay lại danh sách đơn hàng
            </button>
          </div>
        )}

        {/* NỘI DUNG CHI TIẾT KHI ĐÃ CÓ DATA */}
        {!loading && !error && order && (
          <>
            {/* TIẾN TRÌNH ĐƠN HÀNG (TIMELINE) */}
            <OrderTimeline order={order} />

            {/* THÔNG TIN GIAO HÀNG & THANH TOÁN */}
            <OrderShippingPayment order={order} />

            {/* DANH SÁCH SẢN PHẨM & TỔNG TIỀN */}
            <OrderProducts order={order} />
          </>
        )}
      </main>
    </div>
  );
};

export default OrderDetailPage;
