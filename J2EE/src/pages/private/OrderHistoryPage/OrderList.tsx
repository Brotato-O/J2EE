import React, { useState } from 'react';
import {mockOrders} from '../../../data/mockOrders.ts';
interface OrderListProps {
    activeTab: string;
}

function OrderList({ activeTab }: OrderListProps) {

    const filteredOrders = mockOrders.filter((order) => {
        if (activeTab === 'all') {
            return true;
        }

        return order.status === activeTab;
    });

    return (<div className="orders-list">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="order-card">
                {/* Header card đơn hàng */}
                <div className="order-header">
                  <div className="order-meta">
                    <span className="order-id">Mã đơn: <strong>{order.id}</strong></span>
                    <span className="order-date">Ngày đặt: {order.date}</span>
                  </div>
                  <span className={`status-badge status-${order.status}`}>
                    {order.statusText}
                  </span>
                </div>

                {/* Danh sách sản phẩm trong đơn */}
                <div className="order-items-container">
                  {order.products.map((item, idx) => (
                    <div key={idx} className="order-product-item">
                      <img src={item.product.imageUrl} alt={item.product.name} className="product-img" />
                      <div className="product-info">
                        <span className="product-name">{item.product.name}</span>
                        <span className="product-qty">Số lượng: x{item.quantity}</span>
                      </div>
                      <span className="product-price">{item.product.price}</span>
                    </div>
                  ))}
                </div>

                {/* Footer card: Tổng tiền & Nút thao tác */}
                <div className="order-footer">
                  <div className="total-group">
                    <span>Tổng số tiền:</span>
                    <strong className="order-total-price">{order.totalAmount}</strong>
                  </div>
                  <div className="action-buttons">
                    {order.status === 'completed' && (
                      <button className="btn-secondary">Mua lại</button>
                    )}
                    <button className="btn-primary">Xem chi tiết</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-orders">
              <p>Chưa có đơn hàng nào trong mục này.</p>
            </div>
          )}
        </div>)
}

export default OrderList;