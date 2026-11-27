import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./CheckoutPage.css";

import OrderSummary from "./CheckoutPage/OrderSummary";
import PaymentMethod from "./CheckoutPage/PaymentMethod";
import ShippingAddress from "./CheckoutPage/ShippingAddress";

import { createOrderApi } from "../../api/orderApi";

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [recipientProvince, setRecipientProvince] = useState("");
  const [recipientDistrict, setRecipientDistrict] = useState("");
  const [recipientWard, setRecipientWard] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isAddressValid = Boolean(
    address.trim() &&
    recipientProvince.trim() &&
    recipientDistrict.trim() &&
    recipientWard.trim()
  );

  const handlePlaceOrder = async () => {
    // Kiểm tra thông tin giao hàng
    if (!recipientProvince.trim()) {
      setError("Vui lòng nhập Tỉnh / Thành phố.");
      return;
    }
    if (!recipientDistrict.trim()) {
      setError("Vui lòng nhập Quận / Huyện.");
      return;
    }
    if (!recipientWard.trim()) {
      setError("Vui lòng nhập Phường / Xã.");
      return;
    }
    if (!address.trim()) {
      setError("Vui lòng nhập địa chỉ chi tiết (Số nhà, tên đường).");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setError("");

      // Gọi API tạo đơn hàng
      const order = await createOrderApi({
        address: address.trim(),
        recipientProvince: recipientProvince.trim(),
        recipientDistrict: recipientDistrict.trim(),
        recipientWard: recipientWard.trim(),
        paymentMethod: paymentMethod as "COD" | "VIETQR" | "VNPAY" | "MOMO",
      });

      // Đặt hàng thành công
      alert("Đặt hàng thành công!");

      // Chuyển đến trang chi tiết đơn hàng
      navigate(`/orders/my/${order.orderId}`, {
        state: { order },
      });

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Đặt hàng thất bại. Vui lòng thử lại."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page">
      <main className="checkout-container">
        <h1 className="page-title">Thanh toán</h1>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="checkout-grid">
          <div className="checkout-left">
            <ShippingAddress
              address={address}
              recipientProvince={recipientProvince}
              recipientDistrict={recipientDistrict}
              recipientWard={recipientWard}
              onAddressChange={setAddress}
              onProvinceChange={setRecipientProvince}
              onDistrictChange={setRecipientDistrict}
              onWardChange={setRecipientWard}
            />

            <PaymentMethod
              paymentMethod={paymentMethod}
              onPaymentMethodChange={setPaymentMethod}
            />
          </div>

          <div className="checkout-right">
            <OrderSummary
              address={address}
              isAddressValid={isAddressValid}
              onPlaceOrder={handlePlaceOrder}
              isSubmitting={isSubmitting}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CheckoutPage;
