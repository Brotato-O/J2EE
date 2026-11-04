import type {
    CartResponse,
    AddToCartRequest,
} from "../types/Cart";

const API_URL = "http://localhost:8080/api/cart";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');

    if (!token) {
        throw new Error('Không tìm thấy token. Vui lòng đăng nhập lại.');
    }

    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

// Lấy giỏ hàng của người dùng đang đăng nhập
export const getMyCart = async (): Promise<CartResponse> => {
    const response = await fetch(API_URL, {
        method: "GET",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể lấy thông tin giỏ hàng");
    }

    return response.json();
};

// Thêm sản phẩm vào giỏ hàng
export const addToCartApi = async (
    data: AddToCartRequest
): Promise<CartResponse> => {
    const response = await fetch(`${API_URL}/items`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message || "Không thể thêm sản phẩm vào giỏ hàng");
    }

    return response.json();
};

// Cập nhật số lượng
export const updateCartItemApi = async (
    itemId: number,
    quantity: number
): Promise<CartResponse> => {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
        throw new Error("Không thể cập nhật số lượng sản phẩm");
    }

    return response.json();
};

// Xóa một sản phẩm khỏi giỏ
export const removeCartItemApi = async (
    itemId: number
): Promise<CartResponse> => {
    const response = await fetch(`${API_URL}/items/${itemId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể xóa sản phẩm khỏi giỏ hàng");
    }

    return response.json();
};

// Xóa toàn bộ giỏ hàng
export const clearCartApi = async (): Promise<void> => {
    const response = await fetch(API_URL, {
        method: "DELETE",
        headers: getAuthHeaders(),
    });

    if (!response.ok) {
        throw new Error("Không thể xóa giỏ hàng");
    }
};