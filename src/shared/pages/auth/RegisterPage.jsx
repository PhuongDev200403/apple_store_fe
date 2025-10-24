import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../../shared/utils/api/authApi.js';
import './auth.css';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName:'', lastName:'', email:'', phone:'', password:'' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(k, v){ setForm((p)=>({ ...p, [k]: v })); }

  async function handleSubmit(e){
    e.preventDefault();
    setError('');
    const { firstName, lastName, email, phone, password } = form;
    if(!firstName || !lastName || !email || !phone || !password){
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    try {
      setLoading(true);
      const res = await register({ firstName, lastName, email, phone, password });
      if(res?.message){
        // Assume success returns message or token; redirect to login
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
    <div className="auth-container container">
      <form className="auth-card" onSubmit={handleSubmit} noValidate>
        <h1>Đăng ký</h1>
        <div style={{textAlign:'center', color:'#64748b', marginBottom:8}}>Đã có tài khoản, <Link to="/dang-nhap">đăng nhập tại đây</Link></div>
        {error && <div className="auth-error">{error}</div>}
        <div className="form-group"><label>Họ</label><input value={form.lastName} onChange={(e)=>update('lastName', e.target.value)} placeholder="Họ" required/></div>
        <div className="form-group"><label>Tên</label><input value={form.firstName} onChange={(e)=>update('firstName', e.target.value)} placeholder="Tên" required/></div>
        <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e)=>update('email', e.target.value)} placeholder="Email" required/></div>
        <div className="form-group"><label>Số điện thoại</label><input value={form.phone} onChange={(e)=>update('phone', e.target.value)} placeholder="Số điện thoại" required/></div>
        <div className="form-group"><label>Mật khẩu</label><input type="password" value={form.password} onChange={(e)=>update('password', e.target.value)} placeholder="Mật khẩu" required/></div>
        <button className="btn btn-primary" type="submit" disabled={loading}>{loading? 'Đang đăng ký...' : 'Đăng ký'}</button>
        <div className="social-login">
          <button type="button" className="btn btn-facebook">Facebook</button>
          <button type="button" className="btn btn-google">Google</button>
        </div>
      </form>
    </div>
  );
}

