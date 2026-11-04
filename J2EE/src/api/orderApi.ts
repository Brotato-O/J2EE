const API_URL = "http://localhost:8080/api/v1/orders";

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");

    return {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};

export interface OrderRequest {
    address: string;
}

export interface OrderItem {
    orderDetailId: number;
    productId: number;
    productName: string;
    colorName: string;
    sizeName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface OrderResponse {
    orderId: number;
    customerId: number;
    customerName: string;
    orderDate: string;
    status: string;
    address: string;
    totalPrice: number;
    items: OrderItem[];
}

// Tạo đơn hàng
export const createOrderApi = async (
    data: OrderRequest
): Promise<OrderResponse> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Đặt hàng thất bại");
    }

    return response.json();
};

// Lấy danh sách đơn hàng của tôi
export const getMyOrdersApi = async (): Promise<OrderResponse[]> => {
    const response = await fetch(`${API_URL}/my`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể lấy danh sách đơn hàng");
    }

    return response.json();
};

// Lấy chi tiết đơn hàng
export const getMyOrderDetailApi = async (
    id: number
): Promise<OrderResponse> => {
    const response = await fetch(`${API_URL}/my/${id}`, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể lấy chi tiết đơn hàng");
    }

    return response.json();
};

// Hủy đơn hàng
export const cancelOrderApi = async (
    id: number
): Promise<OrderResponse> => {
    const response = await fetch(`${API_URL}/my/${id}/cancel`, {
        method: "PUT",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể hủy đơn hàng");
    }

    return response.json();
};