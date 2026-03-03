import { useState } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/contact', form);
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name:'', email:'', phone:'', subject:'', message:'' });
    } catch { toast.error('Failed to send message'); }
    finally { setLoading(false); }
  };

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, boxSizing:'border-box' };

  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#1e1b4b,#4f46e5)', color:'white', padding:'60px 20px', textAlign:'center' }}>
        <h1 style={{ fontSize:'clamp(28px,5vw,48px)', fontWeight:800, marginBottom:12 }}>Contact Us</h1>
        <p style={{ fontSize:17, opacity:0.9 }}>We're here to help. Reach out anytime!</p>
      </section>
      <div style={{ maxWidth:1000, margin:'0 auto', padding:'60px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1.5fr', gap:40, flexWrap:'wrap' }}>
          <div>
            <h2 style={{ fontWeight:700, fontSize:22, color:'#1e293b', marginBottom:24 }}>Get in Touch</h2>
            {[
              { icon:'📧', title:'Email', val:'support@kaazbazar.com' },
              { icon:'📞', title:'Phone', val:'+880 1700-000000' },
              { icon:'📍', title:'Address', val:'Dhaka, Bangladesh' },
              { icon:'🕐', title:'Hours', val:'8AM - 8PM, 7 days/week' }
            ].map(({ icon, title, val }) => (
              <div key={title} style={{ display:'flex', gap:16, marginBottom:20 }}>
                <div style={{ width:44, height:44, borderRadius:10, background:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{icon}</div>
                <div><div style={{ fontWeight:600, color:'#1e293b', marginBottom:2 }}>{title}</div><div style={{ color:'#64748b', fontSize:14 }}>{val}</div></div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding:32 }}>
            <h2 style={{ fontWeight:700, fontSize:20, marginBottom:24, color:'#1e293b' }}>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                <div><label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Name *</label><input style={inputStyle} value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} required /></div>
                <div><label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Email *</label><input style={inputStyle} type="email" value={form.email} onChange={e => setForm(p=>({...p,email:e.target.value}))} required /></div>
                <div><label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Phone</label><input style={inputStyle} value={form.phone} onChange={e => setForm(p=>({...p,phone:e.target.value}))} /></div>
                <div><label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Subject *</label><input style={inputStyle} value={form.subject} onChange={e => setForm(p=>({...p,subject:e.target.value}))} required /></div>
                <div style={{ gridColumn:'1/-1' }}><label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Message *</label><textarea style={{ ...inputStyle, resize:'vertical', minHeight:100 }} value={form.message} onChange={e => setForm(p=>({...p,message:e.target.value}))} required /></div>
              </div>
              <button type="submit" disabled={loading} style={{ width:'100%', marginTop:16, padding:'13px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                {loading ? 'Sending...' : '📨 Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
