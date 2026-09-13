
import './Footer.css'
export const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Cột 1: Logo & Giới thiệu */}
        <div className="footer-brand">
          <img src="/logo.png" alt="Logo" className="footer-logo" />
          <p className="footer-desc">
            Bruh mọi thời đại
          </p>
        </div>

        {/* Cột 2: Điều hướng nhanh */}
        <div className="footer-links">
          <h4>Khám phá</h4>
          <ul>
            <li><a href="#">Trang chủ</a></li>
            <li><a href="#">Về chúng tôi</a></li>
            <li><a href="#">Cửa hàng</a></li>
            <li><a href="#">Liên hệ</a></li>
          </ul>
        </div>

        {/* Cột 3: Hỗ trợ khách hàng */}
        <div className="footer-links">
          <h4>Hỗ trợ</h4>
          <ul>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Bảng quy đổi kích cỡ</a></li>
            <li><a href="#">Hướng dẫn mua hàng</a></li>
            <li><a href="#">Thanh toán & Giao hàng</a></li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin */}
        <div className="footer-newsletter">
          <h4>Đăng ký nhận ưu đãi</h4>
          <p>Nhận ngay voucher -20% cho đơn hàng đầu tiên!</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Nhập email của bạn..." required />
            <button type="submit">Gửi</button>
          </form>
        </div>
      </div>

      {/* Dòng bản quyền dưới cùng */}
      <div className="footer-bottom">
        <p>&copy; 2026 BabyStreet. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;