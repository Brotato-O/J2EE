function ShippingAddress() {
    return (
        <div className="checkout-card">
            <h2 className="card-title">Thông tin giao hàng</h2>

            <form className="shipping-form">
                <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                        type="text"
                        defaultValue="Test User"
                        placeholder="Nhập họ và tên"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="text"
                            placeholder="0987654321"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="example@gmail.com"
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Địa chỉ nhận hàng</label>
                    <input
                        type="text"
                        placeholder="Số nhà, tên đường, phường/xã..."
                    />
                </div>

                <div className="form-group">
                    <label>Ghi chú đơn hàng (không bắt buộc)</label>
                    <textarea
                        rows={3}
                        placeholder="Ghi chú về đơn hàng, ví dụ: thời gian giao hàng..."
                    />
                </div>
            </form>
        </div>
    );
}

export default ShippingAddress;