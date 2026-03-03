import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post('/admin/login', form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      toast.success('Welcome, Admin!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0f172a' }}>
      <div style={{ width:'100%', maxWidth:380 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:64, height:64, borderRadius:16, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:32, fontWeight:800, color:'white', margin:'0 auto 16px' }}>K</div>
          <h1 style={{ fontSize:26, fontWeight:800, color:'white', marginBottom:6 }}>Admin Login</h1>
          <p style={{ color:'#94a3b8' }}>KaazBazar Control Panel</p>
        </div>
        <div style={{ background:'#1e293b', borderRadius:16, padding:28, border:'1px solid #334155' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:13, fontWeight:600, marginBottom:6 }}>Email</label>
              <input type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required
                style={{ width:'100%', padding:'11px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'white', fontSize:14 }} placeholder="admin@kaazbazar.com" />
            </div>
            <div style={{ marginBottom:24 }}>
              <label style={{ display:'block', color:'#94a3b8', fontSize:13, fontWeight:600, marginBottom:6 }}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm(p=>({...p,password:e.target.value}))} required
                style={{ width:'100%', padding:'11px 14px', background:'#0f172a', border:'1px solid #334155', borderRadius:8, color:'white', fontSize:14 }} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Logging in...' : 'Login to Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
