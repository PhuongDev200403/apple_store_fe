import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../../shared/utils/api/authApi.js';
import './auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu');
      return;
    }
    try {
      setLoading(true);
      const res = await login({ email, password });
      // Expect: { token, role }
      if (res?.token) {
        localStorage.setItem('token', res.token);
        localStorage.setItem('role', res.role || 'user');
        if ((res.role || 'user') === 'admin') navigate('/admin'); else navigate('/');
      } else if (res?.message) {
        setError(res.message);
      } else {
        setError('Đăng nhập thất bại');
      }
    } catch (err) {
      // If backend returns {code,message}
      const msg = err?.message || 'Đăng nhập thất bại';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container container">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Đăng nhập</h1>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Mật khẩu" required />
        </div>
        <button className="btn-primary" type="submit" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'}</button>
        <div className="alt-actions">
          <span>Quên mật khẩu?</span>
          <span>Đăng ký tại đây</span>
        </div>
        <div className="social-login">
          <button type="button" className="btn btn-facebook">Facebook</button>
          <button type="button" className="btn btn-google">Google</button>
        </div>
      </form>
    </div>
  );
}

