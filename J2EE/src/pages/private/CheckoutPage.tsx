
import './CheckoutPage.css';
import OrderSummary from './CheckoutPage/OrderSummary';
import PaymentMethod from './CheckoutPage/PaymentMethod';
import ShippingAddress from './CheckoutPage/ShippingAddress';

export const CheckoutPage: React.FC = () => {
  

  return (
    <div className="checkout-page">

      {/* MAIN CHECKOUT CONTENT */}
      <main className="checkout-container">
        <h1 className="page-title">Thanh toán</h1>

        <div className="checkout-grid">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN */}
          <div className="checkout-left">
            {/* Form địa chỉ giao hàng */}
            <ShippingAddress/>

            {/* Chọn phương thức thanh toán */}
            <PaymentMethod/>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div className="checkout-right">
            <OrderSummary/>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;