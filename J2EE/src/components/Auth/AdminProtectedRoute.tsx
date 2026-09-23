import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoute = () => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    try {
        // JWT có dạng:
        // header.payload.signature

        const payload = token.split(".")[1];

        const decodedPayload = JSON.parse(
            atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        );

        const currentTime = Math.floor(Date.now() / 1000);

        // JWT hết hạn
        if (decodedPayload.exp && decodedPayload.exp <= currentTime) {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminTokenType");
            localStorage.removeItem("adminUser");

            return <Navigate to="/admin/login" replace />;
        }

        // Kiểm tra role
        if (decodedPayload.role !== "Admin") {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminTokenType");
            localStorage.removeItem("adminUser");

            return <Navigate to="/admin/login" replace />;
        }

        return <Outlet />;

    } catch (error) {
        console.error("JWT không hợp lệ:", error);

        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminTokenType");
        localStorage.removeItem("adminUser");

        return <Navigate to="/admin/login" replace />;
    }
};

export default AdminProtectedRoute;