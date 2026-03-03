import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: { bg:'#fef3c7', color:'#92400e', label:'⏳ Pending' },
  confirmed: { bg:'#dbeafe', color:'#1e40af', label:'✅ Confirmed' },
  'in-progress': { bg:'#e0e7ff', color:'#3730a3', label:'🔄 In Progress' },
  completed: { bg:'#d1fae5', color:'#065f46', label:'✔️ Completed' },
  cancelled: { bg:'#fee2e2', color:'#991b1b', label:'❌ Cancelled' },
  rejected: { bg:'#fee2e2', color:'#991b1b', label:'🚫 Rejected' }
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    API.get('/bookings/my').then(({ data }) => setBookings(data.bookings || [])).catch(console.error).finally(() => setLoading(false));
  }, [user, navigate]);

  const updateStatus = async (bookingId, status) => {
    try {
      await API.patch(`/bookings/${bookingId}/status`, { status });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
      toast.success('Status updated');
    } catch { toast.error('Failed to update'); }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 20px' }}>
      {/* Header */}
      <div className="card" style={{ padding:24, marginBottom:24, background:'linear-gradient(135deg,#1e1b4b,#4f46e5)', color:'white', border:'none' }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:16 }}>
          <div>
            <h1 style={{ fontSize:26, fontWeight:800, marginBottom:4 }}>Welcome, {user.name?.split(' ')[0]}! 👋</h1>
            <p style={{ opacity:0.8 }}>{user.role === 'worker' ? 'Worker Dashboard' : 'Customer Dashboard'} • {user.email}</p>
          </div>
          <div style={{ display:'flex', gap:8 }}>
            {user.role === 'user' && <Link to="/workers" style={{ padding:'10px 20px', background:'rgba(255,255,255,0.15)', color:'white', borderRadius:8, fontWeight:600, textDecoration:'none', fontSize:14 }}>Find Workers</Link>}
            {user.role === 'admin' && <Link to="/admin" style={{ padding:'10px 20px', background:'#f59e0b', color:'white', borderRadius:8, fontWeight:700, textDecoration:'none', fontSize:14 }}>Admin Panel</Link>}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:16, marginBottom:24 }}>
        {[
          { label:'Total Bookings', value: bookings.length, icon:'📋' },
          { label:'Pending', value: bookings.filter(b => b.status === 'pending').length, icon:'⏳' },
          { label:'Completed', value: bookings.filter(b => b.status === 'completed').length, icon:'✅' },
          { label:'Cancelled', value: bookings.filter(b => b.status === 'cancelled').length, icon:'❌' }
        ].map(({ label, value, icon }) => (
          <div key={label} className="card" style={{ padding:20, textAlign:'center' }}>
            <div style={{ fontSize:28, marginBottom:8 }}>{icon}</div>
            <div style={{ fontSize:24, fontWeight:800, color:'#1e293b' }}>{value}</div>
            <div style={{ color:'#64748b', fontSize:13 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Bookings */}
      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'20px 24px', borderBottom:'1px solid #f1f5f9' }}>
          <h2 style={{ fontWeight:700, fontSize:18, color:'#1e293b' }}>
            {user.role === 'worker' ? 'Service Requests' : 'My Bookings'}
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign:'center', padding:60 }}><div className="spinner"></div></div>
        ) : bookings.length === 0 ? (
          <div style={{ textAlign:'center', padding:60 }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📭</div>
            <h3 style={{ color:'#1e293b', fontWeight:700, marginBottom:8 }}>No bookings yet</h3>
            <p style={{ color:'#64748b', marginBottom:20 }}>
              {user.role === 'worker' ? 'Service requests will appear here' : 'Find and book a worker to get started'}
            </p>
            {user.role === 'user' && <Link to="/workers" style={{ padding:'12px 24px', background:'#4f46e5', color:'white', borderRadius:8, fontWeight:600, textDecoration:'none' }}>Find Workers</Link>}
          </div>
        ) : (
          <div style={{ padding:16 }}>
            {bookings.map(b => {
              const s = STATUS_COLORS[b.status] || STATUS_COLORS.pending;
              return (
                <div key={b._id} style={{ borderRadius:12, border:'1px solid #f1f5f9', padding:16, marginBottom:12, background:'white' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap', marginBottom:6 }}>
                        <span style={{ fontWeight:700, color:'#1e293b', fontSize:15 }}>{b.serviceType}</span>
                        <span style={{ background:s.bg, color:s.color, fontSize:12, fontWeight:700, padding:'3px 10px', borderRadius:100 }}>{s.label}</span>
                      </div>
                      <p style={{ color:'#64748b', fontSize:13, marginBottom:4 }}>
                        {user.role === 'worker' ? `👤 ${b.clientName}` : `🔧 ${b.worker?.name} (${b.worker?.category})`}
                      </p>
                      <p style={{ color:'#64748b', fontSize:13, marginBottom:4 }}>📅 {new Date(b.scheduledDate).toLocaleDateString('en-BD')} {b.scheduledTime}</p>
                      <p style={{ color:'#64748b', fontSize:13 }}>📍 {b.address}, {b.district}</p>
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontWeight:800, fontSize:18, color:'#1e293b', marginBottom:8 }}>৳{b.estimatedCost || b.totalAmount || 0}</div>
                      <span style={{ background:'#f1f5f9', color:'#64748b', fontSize:12, padding:'3px 10px', borderRadius:100 }}>#{b.bookingId}</span>
                    </div>
                  </div>
                  {/* Actions for workers */}
                  {user.role === 'worker' && b.status === 'pending' && (
                    <div style={{ display:'flex', gap:8, marginTop:12 }}>
                      <button onClick={() => updateStatus(b._id, 'confirmed')} style={{ padding:'8px 16px', background:'#d1fae5', color:'#065f46', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>✅ Accept</button>
                      <button onClick={() => updateStatus(b._id, 'rejected')} style={{ padding:'8px 16px', background:'#fee2e2', color:'#991b1b', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>❌ Reject</button>
                    </div>
                  )}
                  {user.role === 'worker' && b.status === 'confirmed' && (
                    <button onClick={() => updateStatus(b._id, 'completed')} style={{ marginTop:12, padding:'8px 16px', background:'#dbeafe', color:'#1e40af', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>✔️ Mark Completed</button>
                  )}
                  {user.role === 'user' && b.status === 'pending' && (
                    <button onClick={() => updateStatus(b._id, 'cancelled')} style={{ marginTop:12, padding:'8px 16px', background:'#fee2e2', color:'#991b1b', border:'none', borderRadius:8, fontWeight:600, fontSize:13, cursor:'pointer' }}>❌ Cancel</button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
