interface ShippingAddressProps {
    address: string;
    onAddressChange: (address: string) => void;
}

function ShippingAddress({
    address,
    onAddressChange
}: ShippingAddressProps) {
    return (
        <div className="checkout-card">
            <h2 className="card-title">Thông tin giao hàng</h2>

            <textarea
                placeholder="Nhập địa chỉ nhận hàng"
                value={address}
                onChange={(e) => onAddressChange(e.target.value)}
            />
        </div>
    );
}

export default ShippingAddress;