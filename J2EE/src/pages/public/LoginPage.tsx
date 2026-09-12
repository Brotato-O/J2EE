import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../components/Auth/AuthContext';
import { mockUsers } from '../../data/mockUsers';
import { toast } from 'react-toastify';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedUser = mockUsers.find(
      (mockUser) => mockUser.username === username && mockUser.password === password,
    );

    if (matchedUser) {
      login(matchedUser.token, matchedUser.user);
      navigate('/products');
    } else {
      toast.error('Tên đăng nhập hoặc mật khẩu không đúng.');
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