import React, { useState } from 'react';
function PaymentMethod() {
    const [paymentMethod, setPaymentMethod] = useState<'cod' | 'banking'>('cod');
    return(
    <div className="checkout-card">
        <h2 className="card-title">Phương thức thanh toán</h2>
        <div className="payment-options">
            <label className={`payment-item ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                />
                <div className="payment-info">
                    <span className="payment-name">Thanh toán khi nhận hàng (COD)</span>
                    <span className="payment-desc">Thanh toán bằng tiền mặt khi nhận hàng</span>
                </div>
            </label>

            <label className={`payment-item ${paymentMethod === 'banking' ? 'active' : ''}`}>
                <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'banking'}
                    onChange={() => setPaymentMethod('banking')}
                />
                <div className="payment-info">
                    <span className="payment-name">Chuyển khoản ngân hàng (QR Code)</span>
                    <span className="payment-desc">Quét mã QR qua ứng dụng Banking</span>
                </div>
            </label>
        </div>
    </div>
    )
}

export default PaymentMethod;