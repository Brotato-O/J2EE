import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
    return (
        <aside className="admin-sidebar">
            <div className="admin-logo">
                <h2>ADMIN</h2>
            </div>

            <nav className="admin-menu">
                <NavLink to="/admin" end>
                    Dashboard
                </NavLink>

                <NavLink to="/admin/products">
                    Quản lý sản phẩm
                </NavLink>

                <NavLink to="/admin/users">
                    Quản lý người dùng
                </NavLink>
            </nav>
        </aside>
    );
}