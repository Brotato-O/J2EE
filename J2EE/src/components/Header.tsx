import { useState } from 'react';
import type { FormEvent } from 'react';
import { FiChevronDown, FiLogOut, FiSearch, FiShoppingCart, FiUser } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './Auth/AuthContext';
import { useCart } from '../context/CartContext';
import styles from './Header.module.css';

const Header = () => {
  const [search, setSearch] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/products?search=${encodeURIComponent(query)}` : '/products');
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.logo} to="/" aria-label="J2EE Store home">
          <span className={styles.logoMark}>J</span>
          <span>J2EE Store</span>
        </Link>

        <form className={styles.search} onSubmit={handleSearch} role="search">
          <input
            aria-label="Tìm kiếm sản phẩm"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
          />
          <button type="submit" aria-label="Tìm kiếm">
            <FiSearch />
          </button>
        </form>

        <nav className={styles.navigation} aria-label="Điều hướng chính">
          <Link className={styles.productsLink} to="/products">Sản phẩm</Link>
          {isAuthenticated ? (
            <>
              <Link className={styles.cartLink} to="/cart" aria-label={`Giỏ hàng, ${totalItems} sản phẩm`}>
                <FiShoppingCart />
                {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
              </Link>
              <div className={styles.userMenu}>
                <button
                  className={styles.avatarButton}
                  type="button"
                  aria-expanded={isMenuOpen}
                  aria-haspopup="menu"
                  onClick={() => setIsMenuOpen((open) => !open)}
                >
                  <span className={styles.avatar}><FiUser /></span>
                  <span className={styles.userName}>{user?.name || 'Người dùng'}</span>
                  <FiChevronDown className={isMenuOpen ? styles.chevronOpen : undefined} />
                </button>
                {isMenuOpen && (
                  <div className={styles.dropdown} role="menu">
                    <Link to="/profile" role="menuitem" onClick={() => setIsMenuOpen(false)}>Hồ sơ cá nhân</Link>
                    <button type="button" role="menuitem" onClick={handleLogout}>
                      <FiLogOut />
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login">Đăng nhập</Link>
              <Link className={styles.registerLink} to="/register">Đăng ký</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;