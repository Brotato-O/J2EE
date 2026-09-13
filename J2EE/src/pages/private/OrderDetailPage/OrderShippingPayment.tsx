function OrderShippingPayment(){
    return (<div className="info-grid">
          <div className="detail-card">
            <h3 className="sub-title">Địa chỉ nhận hàng</h3>
            <div className="info-content">
              <strong>Test User</strong>
              <p>0987 654 321</p>
              <p>Số 123 Đường Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</p>
            </div>
          </div>

          <div className="detail-card">
            <h3 className="sub-title">Hình thức thanh toán</h3>
            <div className="info-content">
              <p><strong>Thanh toán khi nhận hàng (COD)</strong></p>
              <p className="text-muted">Thanh toán bằng tiền mặt trực tiếp cho shipper khi nhận hàng.</p>
              <span className="payment-status-tag pending">Chưa thanh toán</span>
            </div>
          </div>
        </div>)
}

export default OrderShippingPayment;