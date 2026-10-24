import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import { mockUsers } from '../../data/mockUsers';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.css';
import axios from 'axios';
import axiosClient from '../../config/axiosConfig';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post('api/v1/auth/login', {
        email: username,
        password,
      });

      const data = response.data;

      // Chuyển dữ liệu backend thành đối tượng User
      const user = {
        id: String(data.id),
        name: data.name,
        email: data.email,
      };

      // Lưu token và thông tin người dùng vào AuthContext
      login(data.token, user);
      navigate("/products");
      window.location.reload();

      toast.success('Đăng nhập thành công!');
      // navigate('/products');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 401 ||
          error.response?.status === 400
        ) {
          toast.error(error.message);
        } else {
          toast.error(error.message);
        }
      } else {
        console.error('Unknown error:', error);
        toast.error('Đã xảy ra lỗi không xác định.');
      }
    }
  };


  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Đăng nhập</h2>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label>Username:</label>
          <input className={styles.input} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>Password:</label>
          <input className={styles.input} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className={styles.submit} type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default LoginPage;