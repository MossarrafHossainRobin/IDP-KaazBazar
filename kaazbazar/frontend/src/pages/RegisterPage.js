import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { DISTRICTS } from '../utils/constants';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirmPassword:'', role:'user', district:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register(form);
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally { setLoading(false); }
  };

  const upd = (k, v) => setForm(p => ({...p, [k]: v}));
  const inputStyle = { width:'100%', padding:'11px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 };

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:20, background:'linear-gradient(135deg,#f8fafc,#eef2ff)' }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:16, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, margin:'0 auto 16px', color:'white', fontWeight:800 }}>K</div>
          <h1 style={{ fontSize:28, fontWeight:800, color:'#1e293b', marginBottom:8 }}>Create Account</h1>
          <p style={{ color:'#64748b' }}>Join KaazBazar today</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {/* Role Toggle */}
          <div style={{ display:'flex', marginBottom:24, background:'#f8fafc', borderRadius:10, padding:4 }}>
            {[['user','👤 Customer'],['worker','🔧 Worker']].map(([val, label]) => (
              <button key={val} type="button" onClick={() => upd('role', val)} style={{ flex:1, padding:'10px', borderRadius:8, border:'none', fontWeight:600, fontSize:14, cursor:'pointer', background: form.role === val ? 'white' : 'transparent', color: form.role === val ? '#4f46e5' : '#64748b', boxShadow: form.role === val ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Full Name *</label>
                <input style={inputStyle} value={form.name} onChange={e => upd('name', e.target.value)} required placeholder="Your full name" />
              </div>
              <div>
                <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Email *</label>
                <input style={inputStyle} type="email" value={form.email} onChange={e => upd('email', e.target.value)} required placeholder="email@example.com" />
              </div>
              <div>
                <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Phone</label>
                <input style={inputStyle} value={form.phone} onChange={e => upd('phone', e.target.value)} placeholder="+880..." />
              </div>
              <div>
                <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>District</label>
                <select style={inputStyle} value={form.district} onChange={e => upd('district', e.target.value)}>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Password *</label>
                <input style={inputStyle} type="password" value={form.password} onChange={e => upd('password', e.target.value)} required placeholder="Min 6 chars" />
              </div>
              <div>
                <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Confirm Password *</label>
                <input style={inputStyle} type="password" value={form.confirmPassword} onChange={e => upd('confirmPassword', e.target.value)} required placeholder="Repeat password" />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ width:'100%', marginTop:20, padding:'13px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p style={{ textAlign:'center', marginTop:20, color:'#64748b', fontSize:14 }}>
            Already have an account? <Link to="/login" style={{ color:'#4f46e5', fontWeight:600 }}>Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
