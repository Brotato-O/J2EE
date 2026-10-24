const API_URL = "http://localhost:8080";

export const apiRequest = async (
    endpoint: string,
    options: RequestInit = {}
) => {
    const token = localStorage.getItem("adminToken");
    const tokenType =
        localStorage.getItem("adminTokenType") || "Bearer";

    const headers = new Headers(options.headers);

    headers.set("Content-Type", "application/json");

    if (token) {
        headers.set(
            "Authorization",
            `${tokenType} ${token}`
        );
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            headers,
        }
    );

    // Token hết hạn / không hợp lệ
    if (response.status === 401) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenType");
        localStorage.removeItem("adminUser");

        window.location.href = "/admin/login";

        throw new Error("Phiên đăng nhập đã hết hạn");
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Có lỗi xảy ra"
        );
    }

    return data;
};