import { createBrowserRouter, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import PrivateLayout from '../layouts/PrivateLayout';
import { ProtectedRoute } from '../components/Auth/ProtectedRoute';

// Public Pages
import HomePage from '../pages/public/HomePage';
import ProductsPage from '../pages/public/ProductsPage';
import ProductDetailPage from '../pages/public/ProductDetailPage';
import CartPage from '../pages/public/CartPage';
import LoginPage from '../pages/public/LoginPage';
import RegisterPage from '../pages/public/RegisterPage';

// Private Pages
import CheckoutPage from '../pages/private/CheckoutPage';
import OrderHistoryPage from '../pages/private/OrderHistoryPage';
import ProfilePage from '../pages/private/ProfilePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'cart', element: <CartPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <PrivateLayout />,
        children: [
          { path: 'checkout', element: <CheckoutPage /> },
          { path: 'order-history', element: <OrderHistoryPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);