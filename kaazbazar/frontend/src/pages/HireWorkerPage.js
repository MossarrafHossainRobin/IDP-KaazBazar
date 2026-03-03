import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';
import { DISTRICTS } from '../utils/constants';

export default function HireWorkerPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    clientName: user?.name || '', clientEmail: user?.email || '', clientPhone: '',
    serviceType: '', description: '', scheduledDate: '', scheduledTime: '',
    address: '', district: '', estimatedHours: 1, paymentMethod: 'cash'
  });

  useEffect(() => {
    API.get(`/workers/${id}`).then(({ data }) => setWorker(data.worker)).catch(console.error).finally(() => setLoading(false));
    if (user) setForm(prev => ({ ...prev, clientName: user.name || '', clientEmail: user.email || '' }));
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to book a worker'); navigate('/login'); return; }
    if (!form.clientPhone || !form.serviceType || !form.scheduledDate || !form.address) {
      toast.error('Please fill all required fields'); return;
    }
    setSubmitting(true);
    try {
      const estimatedCost = worker.hourlyRate * form.estimatedHours;
      await API.post('/bookings', { ...form, worker: id, estimatedCost, totalAmount: estimatedCost });
      toast.success('🎉 Booking confirmed! Worker will contact you soon.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally { setSubmitting(false); }
  };

  const upd = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  if (loading) return <div style={{ textAlign:'center', padding:80 }}><div className="spinner"></div></div>;
  if (!worker) return <div style={{ textAlign:'center', padding:80 }}>Worker not found</div>;

  const inputStyle = { width:'100%', padding:'11px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, color:'#1e293b', boxSizing:'border-box' };
  const labelStyle = { display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' };

  return (
    <div style={{ maxWidth:900, margin:'0 auto', padding:'32px 20px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:28, fontWeight:800, color:'#1e293b', marginBottom:6 }}>Book {worker.name}</h1>
        <p style={{ color:'#64748b' }}>{worker.category} • {worker.location?.district} • ৳{worker.hourlyRate}/hr</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24 }}>
        <form onSubmit={handleSubmit}>
          <div className="card" style={{ padding:24, marginBottom:20 }}>
            <h2 style={{ fontWeight:700, fontSize:16, marginBottom:20, color:'#1e293b' }}>Your Information</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input style={inputStyle} value={form.clientName} onChange={e => upd('clientName', e.target.value)} required />
              </div>
              <div>
                <label style={labelStyle}>Phone Number *</label>
                <input style={inputStyle} value={form.clientPhone} onChange={e => upd('clientPhone', e.target.value)} placeholder="+880..." required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" value={form.clientEmail} onChange={e => upd('clientEmail', e.target.value)} />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24, marginBottom:20 }}>
            <h2 style={{ fontWeight:700, fontSize:16, marginBottom:20, color:'#1e293b' }}>Service Details</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={labelStyle}>Service Type *</label>
                <input style={inputStyle} value={form.serviceType} onChange={e => upd('serviceType', e.target.value)} placeholder="e.g. Pipe repair" required />
              </div>
              <div>
                <label style={labelStyle}>Estimated Hours</label>
                <input style={inputStyle} type="number" min={1} max={24} value={form.estimatedHours} onChange={e => upd('estimatedHours', Number(e.target.value))} />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={labelStyle}>Description</label>
                <textarea style={{ ...inputStyle, resize:'vertical', minHeight:90 }} value={form.description} onChange={e => upd('description', e.target.value)} placeholder="Describe the work needed..." />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24, marginBottom:20 }}>
            <h2 style={{ fontWeight:700, fontSize:16, marginBottom:20, color:'#1e293b' }}>Schedule & Location</h2>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
              <div>
                <label style={labelStyle}>Date *</label>
                <input style={inputStyle} type="date" value={form.scheduledDate} onChange={e => upd('scheduledDate', e.target.value)} min={new Date().toISOString().split('T')[0]} required />
              </div>
              <div>
                <label style={labelStyle}>Time</label>
                <input style={inputStyle} type="time" value={form.scheduledTime} onChange={e => upd('scheduledTime', e.target.value)} />
              </div>
              <div>
                <label style={labelStyle}>District *</label>
                <select style={inputStyle} value={form.district} onChange={e => upd('district', e.target.value)} required>
                  <option value="">Select District</option>
                  {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={labelStyle}>Full Address *</label>
                <input style={inputStyle} value={form.address} onChange={e => upd('address', e.target.value)} placeholder="House #, Road, Area..." required />
              </div>
            </div>
          </div>

          <div className="card" style={{ padding:24, marginBottom:20 }}>
            <h2 style={{ fontWeight:700, fontSize:16, marginBottom:16, color:'#1e293b' }}>Payment Method</h2>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[['cash','💵 Cash'],['bkash','📱 bKash'],['nagad','📱 Nagad'],['rocket','📱 Rocket']].map(([val, label]) => (
                <label key={val} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 16px', borderRadius:8, border:`2px solid ${form.paymentMethod === val ? '#4f46e5' : '#e2e8f0'}`, cursor:'pointer', background: form.paymentMethod === val ? '#eef2ff' : 'white' }}>
                  <input type="radio" name="payment" value={val} checked={form.paymentMethod === val} onChange={() => upd('paymentMethod', val)} style={{ display:'none' }} />
                  <span style={{ fontWeight:600, fontSize:14, color: form.paymentMethod === val ? '#4f46e5' : '#475569' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} style={{ width:'100%', padding:'16px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', border:'none', borderRadius:12, fontWeight:700, fontSize:16, cursor: submitting ? 'not-allowed' : 'pointer', opacity: submitting ? 0.7 : 1 }}>
            {submitting ? '⏳ Booking...' : '✅ Confirm Booking'}
          </button>
        </form>

        {/* Order Summary */}
        <div>
          <div className="card" style={{ padding:20, position:'sticky', top:80 }}>
            <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Order Summary</h3>
            <div style={{ display:'flex', alignItems:'center', gap:12, paddingBottom:16, borderBottom:'1px solid #f1f5f9', marginBottom:16 }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:'linear-gradient(135deg,#818cf8,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700, color:'white' }}>
                {worker.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div style={{ fontWeight:700, color:'#1e293b' }}>{worker.name}</div>
                <div style={{ color:'#64748b', fontSize:13 }}>{worker.category}</div>
              </div>
            </div>
            <div style={{ marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                <span style={{ color:'#64748b' }}>Rate per hour</span>
                <span style={{ fontWeight:600 }}>৳{worker.hourlyRate}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8, fontSize:14 }}>
                <span style={{ color:'#64748b' }}>Estimated hours</span>
                <span style={{ fontWeight:600 }}>{form.estimatedHours}</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 0', borderTop:'2px solid #f1f5f9', marginTop:8 }}>
                <span style={{ fontWeight:700, color:'#1e293b' }}>Total Estimate</span>
                <span style={{ fontWeight:800, fontSize:18, color:'#4f46e5' }}>৳{worker.hourlyRate * form.estimatedHours}</span>
              </div>
            </div>
            <p style={{ fontSize:12, color:'#94a3b8', lineHeight:1.7 }}>* Final price may vary based on actual work. Payment after service completion.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
