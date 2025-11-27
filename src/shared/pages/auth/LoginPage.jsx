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

  function decodeJwtPayload(token) {
    if (!token || typeof token !== 'string') return {};
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return {};
      const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '==='.slice((base64.length + 3) % 4);
      const json = atob(padded);
      return JSON.parse(json);
    } catch (_e) {
      return {};
    }
  }

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
      // Chuẩn hoá dữ liệu phản hồi: hỗ trợ nhiều định dạng
      // { token, role }, { data: { token, role } }, { accessToken }, { access_token }
      const payload = res?.data ? res.data : res;
      const token =
        payload?.token ||
        payload?.accessToken ||
        payload?.access_token ||
        payload?.result ||
        payload?.data?.token ||
        payload?.data?.accessToken ||
        payload?.data?.access_token ||
        '';
      let rawRole =
        payload?.role ||
        payload?.roles ||
        payload?.data?.role ||
        payload?.data?.roles ||
        '';

      if (token) {
        // Lưu token/role để sử dụng cho các chức năng khác
        localStorage.setItem('token', token);
        // Nếu phản hồi không có role, thử giải mã từ JWT
        if (!rawRole) {
          const jwt = decodeJwtPayload(token);
          rawRole = jwt?.roles || jwt?.role || '';
        }
        // Chuẩn hoá role về dạng chữ thường; hỗ trợ cả 'ADMIN', 'ROLE_ADMIN', ['ADMIN']...
        let roleStr = Array.isArray(rawRole) ? rawRole.join(',') : String(rawRole || 'user');
        roleStr = roleStr.toLowerCase();
        const isAdmin = roleStr.includes('admin');
        localStorage.setItem('role', isAdmin ? 'admin' : 'user');

        // Dispatch event để Header cập nhật trạng thái đăng nhập
        window.dispatchEvent(new Event('loginStatusChanged'));

        // Điều hướng theo role
        navigate(isAdmin ? '/admin' : '/');
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

