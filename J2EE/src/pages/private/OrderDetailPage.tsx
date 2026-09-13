import React from 'react';
import './OrderDetailPage.css';
import OrderTimeline from './OrderDetailPage/OrderTimeline';
import OrderShippingPayment from './OrderDetailPage/OrderShippingPayment';
import OrderProducts from './OrderDetailPage/OrderProducts';

interface OrderDetailPageProps {
  onBack?: () => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({ onBack }) => {
  return (
    <div className="detail-page">
      

      {/* MAIN CONTENT */}
      <main className="detail-container">
        {/* Thanh điều hướng quay lại */}
        <div className="top-navigation">
          <button className="btn-back" onClick={onBack}>
            ← Quay lại lịch sử đơn hàng
          </button>
          <div className="order-head-info">
            <span>Mã đơn hàng: <strong>ORD-2026-8891</strong></span>
            <span className="divider-dot">•</span>
            <span>Ngày đặt: 12/09/2026</span>
          </div>
        </div>

        {/* TIẾN TRÌNH ĐƠN HÀNG (TIMELINE) */}
        <OrderTimeline/>

        {/* THÔNG TIN GIAO HÀNG & THANH TOÁN */}
        <OrderShippingPayment/>

        {/* DANH SÁCH SẢN PHẨM & TỔNG TIỀN */}
        <OrderProducts />
      </main>
    </div>
  );
};

export default OrderDetailPage;