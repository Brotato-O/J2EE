interface ShippingAddressProps {
    address: string;
    recipientProvince: string;
    recipientDistrict: string;
    recipientWard: string;
    onAddressChange: (address: string) => void;
    onProvinceChange: (province: string) => void;
    onDistrictChange: (district: string) => void;
    onWardChange: (ward: string) => void;
}

function ShippingAddress({
    address,
    recipientProvince,
    recipientDistrict,
    recipientWard,
    onAddressChange,
    onProvinceChange,
    onDistrictChange,
    onWardChange,
}: ShippingAddressProps) {
    return (
        <div className="checkout-card">
            <h2 className="card-title">Thông tin giao hàng</h2>

            <div className="shipping-form">
                <div className="form-group">
                    <label>Tỉnh / Thành phố *</label>
                    <input
                        type="text"
                        placeholder="VD: TP. Hồ Chí Minh"
                        value={recipientProvince}
                        onChange={(e) => onProvinceChange(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Quận / Huyện *</label>
                        <input
                            type="text"
                            placeholder="VD: Quận 7"
                            value={recipientDistrict}
                            onChange={(e) => onDistrictChange(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Phường / Xã *</label>
                        <input
                            type="text"
                            placeholder="VD: Tân Phong"
                            value={recipientWard}
                            onChange={(e) => onWardChange(e.target.value)}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Địa chỉ chi tiết (Số nhà, tên đường) *</label>
                    <textarea
                        rows={2}
                        placeholder="VD: 37/31 đường Trần Văn Mười"
                        value={address}
                        onChange={(e) => onAddressChange(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}

export default ShippingAddress;
