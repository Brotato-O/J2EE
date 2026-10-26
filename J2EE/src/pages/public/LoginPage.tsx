
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.css';
import axios from 'axios';
import axiosClient from '../../config/axiosConfig';

interface LoginData {
  id?: number | string;
  userId?: number | string;
  name?: string;
  email?: string;
  token?: string;
  accessToken?: string;
}

interface LoginResponse {
  code?: number;
  message?: string;
  data?: LoginData;
}

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      toast.warning('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }

    try {
      setLoading(true);

      const response = await axiosClient.post<LoginResponse | LoginData>(
        'api/v1/auth/login',
        {
          email: username.trim(),
          password,
        }
      );

      const result = response.data;

      // Hỗ trợ API trả trực tiếp dữ liệu hoặc bọc trong data
      const data: LoginData =
        'data' in result && result.data
          ? result.data
          : result as LoginData;

      const rawUserId = data.userId ?? data.id;
      const userId = Number(rawUserId);

      const token = data.token ?? data.accessToken;

      if (
        rawUserId == null ||
        !Number.isSafeInteger(userId) ||
        userId <= 0
      ) {
        throw new Error(
          'API đăng nhập không trả về ID người dùng hợp lệ'
        );
      }

      if (!token) {
        throw new Error(
          'API đăng nhập không trả về token'
        );
      }

      if (!data.name || !data.email) {
        throw new Error(
          'API đăng nhập thiếu tên hoặc email người dùng'
        );
      }

      const user = {
        id: String(userId),
        name: data.name,
        email: data.email,
      };

      // Lưu thông tin vào AuthContext và localStorage
      login(token, user);

      toast.success('Đăng nhập thành công!');

      navigate('/products', { replace: true });

    } catch (error) {
      console.error('Lỗi đăng nhập:', error);

      if (axios.isAxiosError(error)) {
        const message =
          error.response?.data?.message ||
          'Đăng nhập thất bại. Vui lòng thử lại.';

        toast.error(message);
      } else if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Đã xảy ra lỗi không xác định.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Đăng nhập</h2>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
      >
        <div className={styles.field}>
          <label htmlFor="email">Email:</label>

          <input
            id="email"
            className={styles.input}
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="password">Mật khẩu:</label>

          <input
            id="password"
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>

        <button
          className={styles.submit}
          type="submit"
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
