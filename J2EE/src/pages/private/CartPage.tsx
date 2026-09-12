import React from 'react';
import { useCart } from '../../context/CartContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  return (
    <div>
      <h2>Giỏ hàng của bạn</h2>
      {cart.length === 0 ? <p>Giỏ hàng đang trống.</p> : cart.map((item) => (
        <div key={item.id}>
          <div>
            <img src={item.imageUrl} alt={item.name} />
            <span>{item.name}</span>
          </div>
          <div>
            <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
            <span>{item.quantity}</span>
            <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <button type="button" onClick={() => removeFromCart(item.id)}>Xóa</button>
        </div>
      ))}
    </div>
  );
};

export default CartPage;
