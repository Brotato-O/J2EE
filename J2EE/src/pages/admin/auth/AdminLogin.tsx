import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { loginAdmin } from "../../../api/authApi";

const AdminLogin = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setError("");

        if (!email || !password) {
            setError("Vui lòng nhập email và mật khẩu");
            return;
        }

        try {
            setLoading(true);

            const response = await loginAdmin({
                email,
                password,
            });

            console.log("Login response:", response);

            if (response.code !== 200) {
                setError(response.message || "Đăng nhập thất bại");
                return;
            }

            const { data } = response;

            // Lưu JWT
            localStorage.setItem("adminToken", data.token);

            // Lưu loại token
            localStorage.setItem("adminTokenType", data.tokenType);

            // Lưu thông tin admin
            localStorage.setItem(
                "adminUser",
                JSON.stringify({
                    userId: data.userId,
                    name: data.name,
                    email: data.email,
                    roleId: data.roleId,
                    roleName: data.roleName,
                })
            );

            // Chuyển vào dashboard
            navigate("/admin", { replace: true });

        } catch (error) {
            console.error(error);

            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Không thể kết nối đến server");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-page">
            <div className="admin-login-card">

                <div className="admin-login-header">
                    <h1>Admin Login</h1>
                    <p>Đăng nhập để quản lý hệ thống</p>
                </div>

                <form
                    className="admin-login-form"
                    onSubmit={handleLogin}
                >
                    <div className="form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>

                        <input
                            type="password"
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    {error && (
                        <p className="admin-login-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="btn-admin-login"
                        disabled={loading}
                    >
                        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
                    </button>
                </form>

            </div>
        </div>
    );
};

export default AdminLogin;