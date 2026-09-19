import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/admin/Dashboard";
import ProductList from "../pages/admin/products/ProductList";
import UserList from "../pages/admin/users/UserList";
import AddProduct from "../pages/admin/products/AddProduct";
import EditProduct from "../pages/admin/products/EditProduct";
export const adminRoutes = {
    path: "/admin",
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
            path: "users",
            element: <UserList />,
        },
    ],
};