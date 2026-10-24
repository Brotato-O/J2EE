import React, { useState } from 'react';
import './OrderHistoryPage.css';
import OrderStatusFilter from './OrderHistoryPage/OrderStatusFilter';
import OrderList from './OrderHistoryPage/OrderList';


export const OrderHistoryPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <div className="history-page">


      {/* MAIN CONTENT */}
      <main className="history-container">
        <h1 className="page-title">Lịch sử đơn hàng</h1>

        {/* BỘ LỌC TÌNH TRẠNG ĐƠN HÀNG */}
        <OrderStatusFilter
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

        {/* DANH SÁCH ĐƠN HÀNG */}
        <OrderList activeTab={activeTab} />
      </main>
      
    </div>
  );
};

export default OrderHistoryPage;