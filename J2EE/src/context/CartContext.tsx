
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';

import type { CartItem, CartResponse } from '../types/Cart';

import {
  getMyCart,
  addToCartApi,
  updateCartItemApi,
  removeCartItemApi,
  clearCartApi,
} from '../api/cartApi';

interface CartContextType {
  cart: CartItem[];
  totalItems: number;
  totalPrice: number;

  refreshCart: () => Promise<void>;

  addVariantToCart: (
    variantId: number,
    quantity: number
  ) => Promise<void>;

  removeFromCart: (cartItemId: number) => Promise<void>;

  updateQuantity: (
    cartItemId: number,
    quantity: number
  ) => Promise<void>;

  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Chuẩn hóa dữ liệu nhận từ backend
  const updateCartState = (response: CartResponse) => {
    const items = (response.items ?? []).map((item) => ({
      ...item,
      quantity: Number(item.quantity ?? 0),
      unitPrice: Number(item.unitPrice ?? 0),
      totalPrice: Number(item.totalPrice ?? 0),
      availableStock: Number(item.availableStock ?? 0),
    }));

    setCart(items);
  };

  // Lấy giỏ hàng từ backend
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      setCart([]);
      return;
    }

    try {
      const response = await getMyCart();

      console.log('Cart API Response:', response);

      updateCartState(response);
    } catch (error) {
      console.error('Lỗi lấy giỏ hàng:', error);
      throw error;
    }
  }, []);

  // Tự động lấy giỏ hàng khi ứng dụng khởi chạy
  useEffect(() => {
    if (localStorage.getItem('token')) {
      refreshCart().catch(console.error);
    }
  }, [refreshCart]);

  // Thêm biến thể vào giỏ hàng
  const addVariantToCart = async (
    variantId: number,
    quantity: number
  ) => {
    if (variantId <= 0 || quantity <= 0) {
      throw new Error('Thông tin sản phẩm không hợp lệ');
    }

    const response = await addToCartApi({
      variantId,
      quantity,
    });

    updateCartState(response);
  };

  // Cập nhật số lượng
  const updateQuantity = async (
    cartItemId: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      throw new Error('Số lượng phải lớn hơn 0');
    }

    const response = await updateCartItemApi(
      cartItemId,
      quantity
    );

    updateCartState(response);
  };

  // Xóa một sản phẩm
  const removeFromCart = async (cartItemId: number) => {
    const response = await removeCartItemApi(cartItemId);

    updateCartState(response);
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = async () => {
    await clearCartApi();
    setCart([]);
  };

  // Tổng số lượng
  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  // Tổng tiền
  const totalPrice = cart.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        totalItems,
        totalPrice,
        refreshCart,
        addVariantToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      'useCart phải được sử dụng bên trong CartProvider'
    );
  }

  return context;
};
