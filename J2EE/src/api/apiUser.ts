
const API_URL = 'http://localhost:8080/api/v1';

export interface UserResponse {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    address: string | null;
    status: number;
    roleId: number;
    roleName: string;
}

interface ApiResponse<T> {
    code: number;
    message: string;
    data: T;
}

export const getUserById = async (
    userId: number
): Promise<UserResponse> => {
    const token = localStorage.getItem('token');

    const response = await fetch(
        `${API_URL}/users/${userId}`,
        {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                ...(token
                    ? { Authorization: `Bearer ${token}` }
                    : {}),
            },
        }
    );

    if (!response.ok) {
        throw new Error(
            `Không thể lấy thông tin người dùng (${response.status})`
        );
    }

    const result: ApiResponse<UserResponse> =
        await response.json();

    if (!result.data) {
        throw new Error('Không tìm thấy thông tin người dùng');
    }

    return result.data;
};
