function OrderSummary(){
    return (
        <div className="checkout-card summary-card">
              <h2 className="card-title">Đơn hàng (1 sản phẩm)</h2>
              
              {/* Danh sách item */}
              <div className="order-item">
                <div className="item-img-placeholder">
                  <img src="https://via.placeholder.com/60" alt="Laptop Gaming ASUS" />
                </div>
                <div className="item-details">
                  <span className="item-name">Laptop Gaming ASUS</span>
                  <span className="item-qty">Số lượng: 1</span>
                </div>
                <span className="item-price">25.000.000 đ</span>
              </div>

              <div className="divider"></div>

              {/* Tính toán tiền */}
              <div className="summary-row">
                <span>Tạm tính</span>
                <span>25.000.000 đ</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className="free-text">Miễn phí</span>
              </div>

              <div className="divider"></div>

              <div className="summary-row total-row">
                <span>Tổng cộng</span>
                <span className="total-price">25.000.000 đ</span>
              </div>

              <button className="btn-submit-order">
                Đặt hàng ngay
              </button>
            </div>
    );
}

export default OrderSummary