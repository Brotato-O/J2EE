import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/products/ProductList";
import AddProduct from "../pages/admin/products/AddProduct";
import EditProduct from "../pages/admin/products/EditProduct";
import UserList from "../pages/admin/users/UserList";
import OrderList from "../pages/admin/orders/OrderList";
import CategoryList from "../pages/admin/categories/CategoryList";
import ColorList from "../pages/admin/colors/ColorList";
import SizeList from "../pages/admin/sizes/SizeList";

import AdminLogin from "../pages/admin/auth/AdminLogin";
import AdminProtectedRoute from "../components/Auth/AdminProtectedRoute";

export const adminRoutes = {
    path: "/admin",
    children: [
        // Trang login admin
        {
            path: "login",
            element: <AdminLogin />,
        },

        // Các trang cần đăng nhập
        {
            element: <AdminProtectedRoute />,
            children: [
                {
                    element: <AdminLayout />,
                    children: [
                        {
                            index: true,
                            element: <Dashboard />,
                        },
                        {
                            path: "products",
                            element: <ProductList />,
                        },
                        {
                            path: "products/add",
                            element: <AddProduct />,
                        },
                        {
                            path: "products/:id/edit",
                            element: <EditProduct />,
                        },
                        {
                            path: "categories",
                            element: <CategoryList />,
                        },
                        {
                            path: "users",
                            element: <UserList />,
                        },
                        {
                            path: "orders",
                            element: <OrderList />,
                        },
                        {
                            path: "colors",
                            element: <ColorList />,
                        },
                        {
                            path: "sizes",
                            element: <SizeList />,
                        },
                    ],
                },
            ],
        },
    ],
};