
import { createBrowserRouter, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';

// PUBLIC PAGES
import HomePage from '../pages/public/HomePage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// PRIVATE PAGES
import CartPage from '../pages/public/CartPage';
import CheckoutPage from '../pages/private/CheckoutPage';
import OrderHistoryPage from '../pages/private/OrderHistoryPage';
import ProfilePage from '../pages/private/ProfilePage';
import FavouritePage from '../pages/private/FavouritePage';
import OrderDetailPage from '../pages/private/OrderDetailPage';

// ADMIN ROUTES
import { adminRoutes } from './AdminRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      // Trang chủ
      {
        index: true,
        element: <HomePage />,
      },

      // Danh sách sản phẩm
      {
        path: 'products',
        element: <ProductsPage />,
      },

      // Chi tiết sản phẩm
      {
        path: 'product/:id',
        element: <ProductDetailPage />,
      },

      // Đăng nhập
      {
        path: 'login',
        element: <LoginPage />,
      },

      // Đăng ký
      {
        path: 'register',
        element: <RegisterPage />,
      },

      // Các trang yêu cầu đăng nhập
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: 'cart',
            element: <CartPage />,
          },
          {
            path: 'checkout',
            element: <CheckoutPage />,
          },
          {
            path: 'order-history',
            element: <OrderHistoryPage />,
          },
          {
            path: 'order-history/:id',
            element: <OrderDetailPage />,
          },
          {
            path: 'profile',
            element: <ProfilePage />,
          },
          {
            path: 'favourite',
            element: <FavouritePage />,
          },
        ],
      },
    ],
  },

  // ADMIN
  adminRoutes,

  // Trang không tồn tại
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
