import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../../shared/utils/api/authApi.js';
import './auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username:'', email:'', phone:'', password:'' });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(k, v){
    setForm((p)=>({ ...p, [k]: v }));
    setErrors((prev)=>({ ...prev, [k]: '' }));
  }

  function validate(){
    const next = {};
    if(!form.username.trim()) next.username = 'Vui lòng nhập tên đăng nhập';
    if(!form.email.trim()) next.email = 'Vui lòng nhập email';
    else if(!/^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/.test(form.email)) next.email = 'Email không hợp lệ';
    if(!form.phone.trim()) next.phone = 'Vui lòng nhập số điện thoại';
    else if(!/^(0|\+?84)[0-9]{8,10}$/.test(form.phone.replace(/\s|-/g,''))) next.phone = 'Số điện thoại không hợp lệ';
    if(!form.password.trim()) next.password = 'Vui lòng nhập mật khẩu';
    else if(form.password.length < 6) next.password = 'Mật khẩu tối thiểu 6 ký tự';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    if(!validate()) return;
    const { username, email, phone, password } = form;
    try {
      setLoading(true);
      const res = await register({ username, email, phone, password });
      if(res?.message){
        navigate('/dang-nhap');
      } else {
        navigate('/dang-nhap');
      }
    } catch(err){
      setError(err?.message || 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-hero"></div>
      <div className="auth-container container">
        <form className="auth-card" onSubmit={handleSubmit} noValidate>
          <div className="auth-header">
            <h1>Đăng ký</h1>
            <p className="auth-subtitle">Tạo tài khoản để mua sắm dễ dàng hơn</p>
          </div>

          <div className="auth-alt">Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập</Link></div>

          {error && <div className="auth-error">{error}</div>}

          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label>Tên đăng nhập</label>
            <input
              value={form.username}
              onChange={(e)=>update('username', e.target.value)}
              placeholder="Tên đăng nhập"
              autoComplete="username"
              required
            />
            {errors.username && <div className="field-error">{errors.username}</div>}
          </div>

          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label>Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e)=>update('email', e.target.value)}
              placeholder="Email"
              autoComplete="email"
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className={`form-group ${errors.phone ? 'has-error' : ''}`}>
            <label>Số điện thoại</label>
            <input
              value={form.phone}
              onChange={(e)=>update('phone', e.target.value)}
              placeholder="Số điện thoại"
              inputMode="tel"
              autoComplete="tel"
              required
            />
            {errors.phone && <div className="field-error">{errors.phone}</div>}
          </div>

          <div className={`form-group ${errors.password ? 'has-error' : ''}`}>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e)=>update('password', e.target.value)}
              placeholder="Mật khẩu"
              autoComplete="new-password"
              required
            />
            <div className="auth-hint">Tối thiểu 6 ký tự, nên bao gồm chữ và số</div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button className="btn btn-primary btn-gradient" type="submit" disabled={loading} aria-busy={loading}>
            {loading? 'Đang đăng ký...' : 'Đăng ký'}
          </button>

          <div className="social-login">
            <button type="button" className="btn btn-facebook">Facebook</button>
            <button type="button" className="btn btn-google">Google</button>
          </div>
        </form>
      </div>
    </div>
  );
}

