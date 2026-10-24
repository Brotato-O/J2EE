export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    code: number;
    message: string;
    data: {
        token: string;
        tokenType: string;
        userId: number;
        name: string;
        email: string;
        roleId: number;
        roleName: string;
    };
}

const API_URL = "http://localhost:8080";

export const loginAdmin = async (
    data: AdminLoginRequest
): Promise<AdminLoginResponse> => {
    const response = await fetch(`${API_URL}/api/v1/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "Đăng nhập thất bại");
    }

    return result;
};