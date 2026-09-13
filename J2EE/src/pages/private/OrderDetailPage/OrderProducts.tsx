function OrderProducts (){
    return (<div className="detail-card">
          <h2 className="card-title">Sản phẩm đã chọn</h2>
          
          <div className="products-list">
            <div className="product-row">
              <img src="https://via.placeholder.com/70" alt="Laptop Gaming ASUS" className="product-thumb" />
              <div className="product-details">
                <span className="product-title">Laptop Gaming ASUS</span>
                <span className="product-variant">Phiên bản: Core i7 / 16GB RAM / 512GB SSD</span>
                <span className="product-qty-text">Số lượng: 1</span>
              </div>
              <span className="product-price-text">25.000.000 đ</span>
            </div>
          </div>

          <div className="price-summary-section">
            <div className="summary-line">
              <span>Tạm tính</span>
              <span>25.000.000 đ</span>
            </div>
            <div className="summary-line">
              <span>Phí vận chuyển</span>
              <span className="free-text">Miễn phí</span>
            </div>
            <div className="summary-line">
              <span>Giảm giá Voucher</span>
              <span>-0 đ</span>
            </div>
            <div className="summary-line total-line">
              <span>Tổng thành tiền</span>
              <span className="final-price">25.000.000 đ</span>
            </div>
          </div>
        </div>)
}

export default OrderProducts;