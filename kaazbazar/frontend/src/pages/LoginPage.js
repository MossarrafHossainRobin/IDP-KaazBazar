import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'linear-gradient(135deg,#f8fafc,#eef2ff)' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px' }}>K</div>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#1e293b', marginBottom:8 }}>Welcome Back</h1>
          <p style={{ color:'#64748b' }}>Login to your KaazBazar account</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Email Address</label>
              <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))} required
                style={{ width:'100%', padding:'12px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }} placeholder="your@email.com" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm(p => ({...p, password: e.target.value}))} required
                style={{ width:'100%', padding:'12px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:20, color:'#64748b', fontSize:14 }}>
            Don't have an account? <Link to="/register" style={{ color:'#4f46e5', fontWeight:600 }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
