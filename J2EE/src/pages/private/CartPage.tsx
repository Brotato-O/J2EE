
import React from 'react';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const CartPage: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    totalItems,
    totalPrice
  } = useCart();

  const formatPrice = (price: number | string | undefined | null) => {
    return Number(price ?? 0).toLocaleString('vi-VN') + ' đ';
  };

  // Cập nhật số lượng
  const handleUpdateQuantity = async (
    itemId: number,
    quantity: number
  ) => {
    if (quantity < 1) return;

    try {
      await updateQuantity(itemId, quantity);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể cập nhật số lượng'
      );
    }
  };

  // Xóa sản phẩm
  const handleRemove = async (itemId: number) => {
    try {
      await removeFromCart(itemId);
      toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Không thể xóa sản phẩm'
      );
    }
  };

  return (
    <div>
      <h2>Giỏ hàng của bạn</h2>

      {cart.length === 0 ? (
        <p>Giỏ hàng đang trống.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item.id}>

              <div>
                <img
                  src={item.image}
                  alt={item.productName}
                  width="100"
                />

                <h3>{item.productName}</h3>

                <p>SKU: {item.sku}</p>

                <p>
                  Màu sắc: {item.color} |
                  Kích thước: {item.size}
                </p>

                <p>
                  Đơn giá: {formatPrice(item.unitPrice)}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    handleUpdateQuantity(
                      item.id,
                      item.quantity - 1
                    )
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  disabled={
                    item.quantity >= item.availableStock
                  }
                  onClick={() =>
                    handleUpdateQuantity(
                      item.id,
                      item.quantity + 1
                    )
                  }
                >
                  +
                </button>
              </div>

              <p>
                Thành tiền: {formatPrice(item.totalPrice)}
              </p>

              <button
                type="button"
                onClick={() => handleRemove(item.id)}
              >
                Xóa
              </button>

              <hr />
            </div>
          ))}

          <h3>Tổng số lượng: {totalItems}</h3>

          <h3>Tổng tiền: {formatPrice(totalPrice)}</h3>
        </>
      )}
    </div>
  );
};

export default CartPage;
