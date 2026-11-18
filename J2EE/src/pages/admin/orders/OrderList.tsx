import { useEffect, useState } from "react";

// ===================== TYPES =====================

interface OrderItem {
    orderDetailId: number;
    productId: number;
    productName: string;
    colorName: string;
    sizeName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

interface Order {
    orderId: number;
    customerId: number;
    customerName: string;
    orderDate: string;
    status: string;      // là displayName tiếng Việt: "Chờ xác nhận", "Đã xác nhận"...
    address: string;
    totalPrice: number;
    items: OrderItem[];
}

// getAllOrders trả về PageResponse<OrderResponse> trực tiếp (không wrap ApiResponse)
interface PageResponse {
    content: Order[];
    page_no: number;        // bắt đầu từ 0
    page_size: number;
    total_elements: number;
    total_pages: number;
    is_last: boolean;
}

// ===================== CONSTANTS =====================

// enum name → dùng để gửi lên backend
const ORDER_STATUS_ENUMS = [
    "NEW",
    "CONFIRMED",
    "PACKING",
    "SHIPPING",
    "DELIVERED",
    "DELIVERY_FAILED",
    "RETURNED",
    "CANCELLED",
];

// displayName tiếng Việt → tương ứng với giá trị backend lưu trong DB
const STATUS_DISPLAY: Record<string, string> = {
    NEW: "Chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    PACKING: "Đang đóng gói",
    SHIPPING: "Đang giao",
    DELIVERED: "Đã giao hàng",
    DELIVERY_FAILED: "Giao hàng thất bại",
    RETURNED: "Đã hoàn hàng",
    CANCELLED: "Đã hủy",
};

// Màu badge cho từng status (key = displayName tiếng Việt)
const STATUS_COLOR: Record<string, { bg: string; color: string }> = {
    "Chờ xác nhận": { bg: "#fef3c7", color: "#b45309" },
    "Đã xác nhận": { bg: "#dbeafe", color: "#1d4ed8" },
    "Đang đóng gói": { bg: "#e0f2fe", color: "#0369a1" },
    "Đang giao": { bg: "#ede9fe", color: "#7c3aed" },
    "Đã giao hàng": { bg: "#dcfce7", color: "#15803d" },
    "Giao hàng thất bại": { bg: "#fee2e2", color: "#dc2626" },
    "Đã hoàn hàng": { bg: "#f3f4f6", color: "#6b7280" },
    "Đã hủy": { bg: "#fee2e2", color: "#dc2626" },
};

// Lọc theo filter: gửi displayName lên backend
const FILTER_OPTIONS = [
    { label: "Tất cả", value: "" },
    { label: "Chờ xác nhận", value: "NEW" },
    { label: "Đã xác nhận", value: "CONFIRMED" },
    { label: "Đang đóng gói", value: "PACKING" },
    { label: "Đang giao", value: "SHIPPING" },
    { label: "Đã giao hàng", value: "DELIVERED" },
    { label: "Giao hàng thất bại", value: "DELIVERY_FAILED" },
    { label: "Đã hoàn hàng", value: "RETURNED" },
    { label: "Đã hủy", value: "CANCELLED" },
];
// ===================== HELPERS =====================

const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    return dateStr;   // backend lưu dạng "dd-MM-yy"
};

const formatPrice = (price: number) =>
    (price ?? 0).toLocaleString("vi-VN") + " đ";

// ===================== COMPONENT =====================

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [page, setPage] = useState(0);                 // 0-based
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [filterStatus, setFilterStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Modal xem chi tiết
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    // Modal cập nhật trạng thái
    const [updatingOrder, setUpdatingOrder] = useState<Order | null>(null);
    const [newStatus, setNewStatus] = useState("");
    const [updateLoading, setUpdateLoading] = useState(false);

    // ========================
    // LẤY DANH SÁCH ĐƠN HÀNG
    // getAllOrders → trả PageResponse trực tiếp (không wrap ApiResponse)
    // ========================
    const fetchOrders = async (pageNum = 0, status = filterStatus) => {
        try {
            setLoading(true);
            setError("");

            let url = `http://localhost:8080/api/v1/orders?page=${pageNum}&size=${pageSize}`;
            if (status) url += `&status=${encodeURIComponent(status)}`;

            const response = await fetch(url, { headers: getAuthHeaders() });

            if (!response.ok) {
                const errJson = await response.json().catch(() => null);
                throw new Error(errJson?.message || `HTTP ${response.status}`);
            }

            const result: PageResponse = await response.json();

            setOrders(result.content || []);
            setPage(result.page_no);           // 0-based từ backend
            setTotalPages(result.total_pages);
            setTotalElements(result.total_elements);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Không thể tải danh sách đơn hàng"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(0, "");
    }, []);

    // ========================
    // LỌC THEO TRẠNG THÁI
    // ========================
    const handleFilterChange = (status: string) => {
        setFilterStatus(status);
        fetchOrders(0, status);
    };

    // ========================
    // PHÂN TRANG
    // ========================
    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) return;
        fetchOrders(newPage, filterStatus);
    };

    // ========================
    // CẬP NHẬT TRẠNG THÁI
    // Gửi enum name (NEW, CONFIRMED...) lên backend
    // ========================
    const handleOpenUpdateStatus = (order: Order) => {
        setUpdatingOrder(order);
        // Tìm enum tương ứng với displayName hiện tại
        const enumKey = Object.entries(STATUS_DISPLAY).find(
            ([, v]) => v === order.status
        )?.[0] ?? "NEW";
        setNewStatus(enumKey);
    };

    const handleUpdateStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!updatingOrder) return;

        try {
            setUpdateLoading(true);

            const response = await fetch(
                `http://localhost:8080/api/v1/orders/${updatingOrder.orderId}/status`,
                {
                    method: "PUT",
                    headers: getAuthHeaders(),
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Cập nhật trạng thái thất bại");
            }

            alert("Cập nhật trạng thái thành công!");
            setUpdatingOrder(null);
            fetchOrders(page, filterStatus);
        } catch (err) {
            alert(
                err instanceof Error
                    ? err.message
                    : "Có lỗi xảy ra khi cập nhật trạng thái"
            );
        } finally {
            setUpdateLoading(false);
        }
    };

    // ========================
    // LOADING / ERROR
    // ========================
    if (loading) {
        return (
            <div>
                <div className="page-header"><h1>Quản lý đơn hàng</h1></div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center" }}>
                        Đang tải danh sách đơn hàng...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className="page-header"><h1>Quản lý đơn hàng</h1></div>
                <div className="admin-table-wrapper">
                    <p style={{ padding: "30px", textAlign: "center", color: "red" }}>{error}</p>
                    <div style={{ textAlign: "center", paddingBottom: "20px" }}>
                        <button className="btn-add" onClick={() => fetchOrders(0, filterStatus)}>
                            Thử lại
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ========================
    // RENDER
    // ========================
    return (
        <div>
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1>Quản lý đơn hàng</h1>
                    <p style={{ margin: "4px 0 0", color: "#6b7280" }}>
                        Tổng số: <strong>{totalElements}</strong> đơn hàng
                    </p>
                </div>
            </div>

            {/* BỘ LỌC */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
                {FILTER_OPTIONS.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => handleFilterChange(opt.value)}
                        style={{
                            padding: "7px 14px",
                            borderRadius: "999px",
                            border: "1px solid #d1d5db",
                            background: filterStatus === opt.value ? "#2563eb" : "#fff",
                            color: filterStatus === opt.value ? "#fff" : "#374151",
                            fontWeight: 500,
                            cursor: "pointer",
                            fontSize: "13px",
                            transition: "0.2s",
                        }}
                    >
                        {opt.label}
                    </button>
                ))}
            </div>

            {/* TABLE */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Mã đơn</th>
                            <th>Khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Địa chỉ</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: "center", padding: "30px" }}>
                                    Không có đơn hàng nào
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const sc = STATUS_COLOR[order.status] ?? { bg: "#f3f4f6", color: "#374151" };
                                return (
                                    <tr key={order.orderId}>
                                        <td><strong>#{order.orderId}</strong></td>
                                        <td>{order.customerName}</td>
                                        <td>{formatDate(order.orderDate)}</td>
                                        <td
                                            style={{ maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
                                            title={order.address}
                                        >
                                            {order.address}
                                        </td>
                                        <td><strong>{formatPrice(order.totalPrice)}</strong></td>
                                        <td>
                                            <span style={{
                                                display: "inline-block",
                                                padding: "4px 10px",
                                                borderRadius: "999px",
                                                fontSize: "12px",
                                                fontWeight: 600,
                                                background: sc.bg,
                                                color: sc.color,
                                                whiteSpace: "nowrap",
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <button
                                                className="btn-view"
                                                style={{ marginRight: "6px" }}
                                                onClick={() => setSelectedOrder(order)}
                                            >
                                                Xem
                                            </button>
                                            <button
                                                className="btn-edit"
                                                onClick={() => handleOpenUpdateStatus(order)}
                                            >
                                                Cập nhật
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* PAGINATION */}
            <div className="admin-pagination">
                <button disabled={page === 0} onClick={() => handlePageChange(page - 1)}>
                    ← Trước
                </button>
                <span>
                    Trang <strong>{page + 1}</strong> / <strong>{totalPages}</strong>
                </span>
                <button disabled={page >= totalPages - 1} onClick={() => handlePageChange(page + 1)}>
                    Sau →
                </button>
            </div>

            {/* ===== MODAL XEM CHI TIẾT ===== */}
            {selectedOrder && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: "720px" }}>
                        <div className="admin-modal-header">
                            <h2>Chi tiết đơn hàng #{selectedOrder.orderId}</h2>
                            <button onClick={() => setSelectedOrder(null)}>×</button>
                        </div>

                        <div style={{ marginBottom: "16px", lineHeight: "1.8" }}>
                            <p style={{ margin: "6px 0" }}><strong>Khách hàng:</strong> {selectedOrder.customerName}</p>
                            <p style={{ margin: "6px 0" }}><strong>Ngày đặt:</strong> {formatDate(selectedOrder.orderDate)}</p>
                            <p style={{ margin: "6px 0" }}><strong>Địa chỉ:</strong> {selectedOrder.address}</p>
                            <p style={{ margin: "6px 0" }}><strong>Trạng thái:</strong> {selectedOrder.status}</p>
                            <p style={{ margin: "6px 0" }}><strong>Tổng tiền:</strong> {formatPrice(selectedOrder.totalPrice)}</p>
                        </div>

                        <h3 style={{ marginBottom: "10px", fontSize: "15px" }}>Sản phẩm trong đơn</h3>
                        <div style={{ overflowX: "auto" }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Màu</th>
                                        <th>Size</th>
                                        <th>SL</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(selectedOrder.items ?? []).length === 0 ? (
                                        <tr>
                                            <td colSpan={6} style={{ textAlign: "center", padding: "16px" }}>
                                                Không có sản phẩm
                                            </td>
                                        </tr>
                                    ) : (
                                        selectedOrder.items.map((item) => (
                                            <tr key={item.orderDetailId}>
                                                <td>{item.productName}</td>
                                                <td>{item.colorName}</td>
                                                <td>{item.sizeName}</td>
                                                <td>{item.quantity}</td>
                                                <td>{formatPrice(item.price)}</td>
                                                <td><strong>{formatPrice(item.totalPrice)}</strong></td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="admin-modal-footer">
                            <button className="btn-view" onClick={() => setSelectedOrder(null)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}

            {/* ===== MODAL CẬP NHẬT TRẠNG THÁI ===== */}
            {updatingOrder && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal" style={{ maxWidth: "420px" }}>
                        <div className="admin-modal-header">
                            <h2>Cập nhật trạng thái</h2>
                            <button onClick={() => setUpdatingOrder(null)}>×</button>
                        </div>

                        <p style={{ marginBottom: "16px", color: "#6b7280" }}>
                            Đơn hàng <strong>#{updatingOrder.orderId}</strong> — {updatingOrder.customerName}
                        </p>
                        <p style={{ marginBottom: "16px" }}>
                            Trạng thái hiện tại:{" "}
                            <strong>{updatingOrder.status}</strong>
                        </p>

                        <form className="admin-form" onSubmit={handleUpdateStatus}>
                            <div className="form-group">
                                <label>Trạng thái mới</label>
                                <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                    {ORDER_STATUS_ENUMS.map((enumKey) => (
                                        <option key={enumKey} value={enumKey}>
                                            {STATUS_DISPLAY[enumKey]}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-modal-footer">
                                <button type="button" className="btn-view" onClick={() => setUpdatingOrder(null)}>
                                    Hủy
                                </button>
                                <button type="submit" className="btn-edit" disabled={updateLoading}>
                                    {updateLoading ? "Đang lưu..." : "Lưu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
