import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: number;
    roleId: number;
    roleName: string;
}

interface UserResponse {
    code: number;
    message: string;
    data: {
        content: User[];
        page_no: number;
        page_size: number;
        total_elements: number;
        total_pages: number;
        is_last: boolean;
    };
}

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);

    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // User đang xem
    const [selectedUser, setSelectedUser] = useState<User | null>(null);

    // User đang sửa
    const [editingUser, setEditingUser] = useState<User | null>(null);

    // Form sửa
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        status: 0,
        roleId: 2,
    });

    // =========================
    // LẤY DANH SÁCH USER
    // =========================
    const fetchUsers = async (pageNumber: number) => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("adminToken");

            console.log("Token:", token);

            if (!token) {
                throw new Error("Không tìm thấy token đăng nhập");
            }

            const url =
                `http://localhost:8080/api/v1/users?page=${pageNumber}&size=20`;

            console.log("Calling:", url);

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            console.log("HTTP status:", response.status);

            const result = await response.json();

            console.log("Backend response:", result);

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    `Request thất bại: HTTP ${response.status}`
                );
            }

            setUsers(result.data.content);
            setPage(result.data.page_no);
            setTotalPages(result.data.total_pages);
            setTotalElements(result.data.total_elements);

        } catch (err) {
            console.error("Lỗi lấy danh sách user:", err);

            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Không thể tải danh sách người dùng");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(0);
    }, []);

    // =========================
    // XEM USER
    // =========================
    const handleView = async (id: number) => {
        try {
            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                `http://localhost:8080/api/v1/users/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Không thể lấy thông tin user");
            }

            const result = await response.json();

            setSelectedUser(result.data);
        } catch (err) {
            console.error(err);
            alert("Không thể lấy thông tin người dùng");
        }
    };

    // =========================
    // MỞ FORM SỬA
    // =========================
    const handleEdit = (user: User) => {
        setEditingUser(user);

        setFormData({
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            status: user.status,
            roleId: user.roleId,
        });
    };

    // =========================
    // THAY ĐỔI FORM
    // =========================
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                name === "status" || name === "roleId"
                    ? Number(value)
                    : value,
        }));
    };

    // =========================
    // LƯU USER
    // =========================
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingUser) {
            return;
        }

        try {
            const token = localStorage.getItem("adminToken");

            const response = await fetch(
                `http://localhost:8080/api/v1/users/${editingUser.id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(formData),
                }
            );

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Cập nhật user thất bại"
                );
            }

            alert("Cập nhật user thành công");

            // Đóng form
            setEditingUser(null);

            // Load lại danh sách
            fetchUsers(page);
        } catch (err) {
            console.error(err);

            if (err instanceof Error) {
                alert(err.message);
            } else {
                alert("Cập nhật user thất bại");
            }
        }
    };

    // =========================
    // PHÂN TRANG
    // =========================
    const handlePageChange = (newPage: number) => {
        if (newPage < 0 || newPage >= totalPages) {
            return;
        }

        fetchUsers(newPage);
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý người dùng</h1>
                </div>

                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error) {
        return (
            <div>
                <div className="page-header">
                    <h1>Quản lý người dùng</h1>
                </div>

                <p className="admin-login-error">{error}</p>
            </div>
        );
    }

    return (
        <div>
            {/* ================= HEADER ================= */}
            <div className="page-header">
                <div>
                    <h1>Quản lý người dùng</h1>

                    <p>
                        Tổng số người dùng:{" "}
                        <strong>{totalElements}</strong>
                    </p>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="admin-table-wrapper">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Họ tên</th>
                            <th>Email</th>
                            <th>Số điện thoại</th>
                            <th>Địa chỉ</th>
                            <th>Vai trò</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={8}>
                                    Không có người dùng
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>

                                    <td>
                                        <strong>{user.name}</strong>
                                    </td>

                                    <td>{user.email}</td>

                                    <td>{user.phone}</td>

                                    <td>{user.address}</td>

                                    <td>
                                        <span
                                            className={
                                                user.roleId === 1
                                                    ? "user-role admin"
                                                    : "user-role"
                                            }
                                        >
                                            {user.roleName}
                                        </span>
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                user.status === 0
                                                    ? "user-status active"
                                                    : "user-status locked"
                                            }
                                        >
                                            {user.status === 0
                                                ? "ACTIVE"
                                                : "LOCKED"}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="btn-view"
                                            onClick={() =>
                                                handleView(user.id)
                                            }
                                        >
                                            Xem
                                        </button>

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                handleEdit(user)
                                            }
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ================= PAGINATION ================= */}
            <div className="admin-pagination">
                <button
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                >
                    ← Trước
                </button>

                <span>
                    Trang <strong>{page + 1}</strong> /{" "}
                    <strong>{totalPages}</strong>
                </span>

                <button
                    disabled={page === totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Sau →
                </button>
            </div>

            {/* ================= VIEW MODAL ================= */}
            {selectedUser && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h2>Thông tin người dùng</h2>

                            <button
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-user-detail">
                            <p>
                                <strong>ID:</strong>{" "}
                                {selectedUser.id}
                            </p>

                            <p>
                                <strong>Họ tên:</strong>{" "}
                                {selectedUser.name}
                            </p>

                            <p>
                                <strong>Email:</strong>{" "}
                                {selectedUser.email}
                            </p>

                            <p>
                                <strong>Số điện thoại:</strong>{" "}
                                {selectedUser.phone}
                            </p>

                            <p>
                                <strong>Địa chỉ:</strong>{" "}
                                {selectedUser.address}
                            </p>

                            <p>
                                <strong>Vai trò:</strong>{" "}
                                {selectedUser.roleName}
                            </p>

                            <p>
                                <strong>Trạng thái:</strong>{" "}
                                {selectedUser.status === 0
                                    ? "ACTIVE"
                                    : "LOCKED"}
                            </p>
                        </div>

                        <div className="admin-modal-footer">
                            <button
                                className="btn-view"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                Đóng
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ================= EDIT MODAL ================= */}
            {editingUser && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <div className="admin-modal-header">
                            <h2>Sửa người dùng</h2>

                            <button
                                onClick={() =>
                                    setEditingUser(null)
                                }
                            >
                                ×
                            </button>
                        </div>

                        <form
                            className="admin-form"
                            onSubmit={handleUpdate}
                        >
                            <div className="form-group">
                                <label>Họ tên</label>

                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Email</label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Số điện thoại</label>

                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Địa chỉ</label>

                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>Vai trò</label>

                                <select
                                    name="roleId"
                                    value={formData.roleId}
                                    onChange={handleChange}
                                >
                                    <option value={1}>
                                        Admin
                                    </option>

                                    <option value={2}>
                                        User
                                    </option>

                                    <option value={3}>
                                        Nhân Viên
                                    </option>

                                    <option value={4}>
                                        Nhân Viên Kho
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Trạng thái</label>

                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <option value={0}>
                                        ACTIVE
                                    </option>

                                    <option value={1}>
                                        LOCKED
                                    </option>
                                </select>
                            </div>

                            <div className="admin-modal-footer">
                                <button
                                    type="button"
                                    className="btn-view"
                                    onClick={() =>
                                        setEditingUser(null)
                                    }
                                >
                                    Hủy
                                </button>

                                <button
                                    type="submit"
                                    className="btn-edit"
                                >
                                    Lưu thay đổi
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}