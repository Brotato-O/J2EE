import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className={styles.page}>
      <h2>Thông tin người dùng</h2>
      {user ? (
        <div className={styles.content}>
          <div className={styles.info}>
            <p><strong>Họ tên:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </div>
          <div className={styles.links}>
            <h3>Quản lý tài khoản</h3>
            <Link to="/cart">Giỏ hàng</Link>
            <Link to="/checkout">Thanh toán</Link>
            <Link to="/order-history">Lịch sử đơn hàng</Link>
          </div>
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
};

export default ProfilePage;