import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    getMyOrdersApi,
    type OrderResponse,
} from '../../../api/orderApi';

interface OrderListProps {
    activeTab: string;
}

// Chuyển trạng thái backend thành trạng thái sử dụng trên giao diện
const getOrderStatus = (status: string): string => {
    const value = status.toUpperCase();

    switch (value) {
        case 'COMPLETED':
        case 'DELIVERED':
            return 'completed';

        case 'SHIPPING':
        case 'SHIPPED':
            return 'shipping';

        case 'CANCELLED':
        case 'CANCELED':
            return 'cancelled';

        default:
            return value.toLowerCase();
    }
};

const getStatusText = (status: string): string => {
    const value = status.toUpperCase();

    switch (value) {
        case 'PENDING':
            return 'Chờ xác nhận';
        case 'CONFIRMED':
            return 'Đã xác nhận';
        case 'PROCESSING':
            return 'Đang xử lý';
        case 'SHIPPING':
        case 'SHIPPED':
            return 'Đang giao hàng';
        case 'DELIVERED':
        case 'COMPLETED':
            return 'Giao hàng thành công';
        case 'CANCELLED':
        case 'CANCELED':
            return 'Đã hủy';
        default:
            return status;
    }
};

const formatPrice = (price: number) => {
    return Number(price ?? 0).toLocaleString('vi-VN') + ' đ';
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('vi-VN');
};

function OrderList({ activeTab }: OrderListProps) {
    const navigate = useNavigate();

    const [orders, setOrders] = useState<OrderResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                setError('');

                const data = await getMyOrdersApi();
                setOrders(data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Không thể tải danh sách đơn hàng'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    const filteredOrders = orders.filter((order) => {
        if (activeTab === 'all') {
            return true;
        }

        return getOrderStatus(order.status) === activeTab;
    });

    if (loading) {
        return (
            <div className="orders-list">
                <p>Đang tải đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="orders-list">
                <p>{error}</p>
                <button
                    className="btn-primary"
                    onClick={() => window.location.reload()}
                >
                    Thử lại
                </button>
            </div>
        );
    }

    return (
        <div className="orders-list">
            {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                    <div key={order.orderId} className="order-card">

                        {/* Header đơn hàng */}
                        <div className="order-header">
                            <div className="order-meta">
                                <span className="order-id">
                                    Mã đơn: <strong>{order.orderId}</strong>
                                </span>

                                <span className="order-date">
                                    Ngày đặt: {formatDate(order.orderDate)}
                                </span>
                            </div>

                            <span
                                className={`status-badge status-${getOrderStatus(order.status)}`}
                            >
                                {getStatusText(order.status)}
                            </span>
                        </div>

                        {/* Danh sách sản phẩm */}
                        <div className="order-items-container">
                            {order.items?.map((item) => (
                                <div
                                    key={item.orderDetailId}
                                    className="order-product-item"
                                >
                                    <div className="product-info">
                                        <span className="product-name">
                                            {item.productName}
                                        </span>

                                        <span className="product-qty">
                                            Màu: {item.colorName || 'Không có'}
                                            {' | '}
                                            Size: {item.sizeName || 'Không có'}
                                        </span>

                                        <span className="product-qty">
                                            Số lượng: x{item.quantity}
                                        </span>
                                    </div>

                                    <span className="product-price">
                                        {formatPrice(item.totalPrice)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Footer đơn hàng */}
                        <div className="order-footer">
                            <div className="total-group">
                                <span>Tổng số tiền:</span>

                                <strong className="order-total-price">
                                    {formatPrice(order.totalPrice)}
                                </strong>
                            </div>

                            <div className="action-buttons">
                                {getOrderStatus(order.status) === 'completed' && (
                                    <button className="btn-secondary">
                                        Mua lại
                                    </button>
                                )}

                                <button
                                    className="btn-primary"
                                    onClick={() =>
                                        navigate(`/order-history/${order.orderId}`)
                                    }
                                >
                                    Xem chi tiết
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            ) : (
                <div className="empty-orders">
                    <p>Chưa có đơn hàng nào trong mục này.</p>
                </div>
            )}
        </div>
    );
}

export default OrderList;
