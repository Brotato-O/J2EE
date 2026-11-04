interface PaymentMethodProps {
    paymentMethod: string;
    onPaymentMethodChange: (method: string) => void;
}

function PaymentMethod({
    paymentMethod,
    onPaymentMethodChange
}: PaymentMethodProps) {
    return (
        <div className="checkout-card">
            <h2 className="card-title">Phương thức thanh toán</h2>

            <label>
                <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) =>
                        onPaymentMethodChange(e.target.value)
                    }
                />
                Thanh toán khi nhận hàng (COD)
            </label>
        </div>
    );
}

export default PaymentMethod;