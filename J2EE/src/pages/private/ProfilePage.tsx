
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAuth } from '../../components/Auth/AuthContext';
import { getUserById } from '../../api/apiUser';
import type { UserResponse } from '../../api/apiUser';

import styles from './ProfilePage.module.css';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  const [profile, setProfile] = useState<UserResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log("User từ AuthContext:", user);
  useEffect(() => {
    let cancelled = false;

    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      // AuthContext cần cung cấp ID của người dùng
      const userId = Number(user.id);

      if (!Number.isInteger(userId) || userId <= 0) {
        setError('Không xác định được ID người dùng.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');

        const data = await getUserById(userId);

        if (!cancelled) {
          setProfile(data);
        }
      } catch (err) {
        console.error('Lỗi tải hồ sơ:', err);

        if (!cancelled) {
          setError('Không thể tải thông tin người dùng.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <h2>Thông tin người dùng</h2>
        <p>Đang tải thông tin...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <h2>Thông tin người dùng</h2>
        <p role="alert">{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className={styles.page}>
        <h2>Thông tin người dùng</h2>
        <p>Không tìm thấy thông tin tài khoản.</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h2>Thông tin người dùng</h2>

      <div className={styles.content}>
        <div className={styles.info}>
          <p>
            <strong>Mã người dùng:</strong> {profile.id}
          </p>

          <p>
            <strong>Họ và tên:</strong> {profile.name}
          </p>

          <p>
            <strong>Email:</strong> {profile.email}
          </p>

          <p>
            <strong>Số điện thoại:</strong>{' '}
            {profile.phone || 'Chưa cập nhật'}
          </p>

          <p>
            <strong>Địa chỉ:</strong>{' '}
            {profile.address || 'Chưa cập nhật'}
          </p>

          <p>
            <strong>Vai trò:</strong> {profile.roleName}
          </p>

          <p>
            <strong>Trạng thái:</strong>{' '}
            {profile.status === 0
              ? 'Đang hoạt động'
              : 'Không hoạt động'}
          </p>
        </div>

        <div className={styles.links}>
          <h3>Quản lý tài khoản</h3>

          <Link to="/cart">Giỏ hàng</Link>
          <Link to="/checkout">Thanh toán</Link>
          <Link to="/order-history">
            Lịch sử đơn hàng
          </Link>
          <Link to="/favourite">
            Danh sách yêu thích
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
