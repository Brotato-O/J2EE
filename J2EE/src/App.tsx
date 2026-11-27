import { RouterProvider } from 'react-router-dom';
import { router } from './router/index';
import { AuthProvider } from './components/Auth/AuthContext';
import { CartProvider } from './context/CartContext';
import { FavouriteProvider } from './context/FavouriteContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavouriteProvider>
          <RouterProvider router={router} />
          {/* Đặt ToastContainer ở đây để có thể gọi ở mọi nơi */}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </FavouriteProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;

