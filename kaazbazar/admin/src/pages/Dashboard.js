import { useState, useEffect } from 'react';
import API from '../utils/api';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card" style={{ padding:24 }}>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
      <div>
        <p style={{ color:'#64748b', fontSize:13, marginBottom:6, fontWeight:600 }}>{label}</p>
        <p style={{ fontSize:28, fontWeight:800, color:'#1e293b' }}>{value}</p>
        {sub && <p style={{ fontSize:12, color:'#94a3b8', marginTop:4 }}>{sub}</p>}
      </div>
      <div style={{ width:48, height:48, borderRadius:12, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22 }}>{icon}</div>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/admin/stats').then(({ data }) => {
      setStats(data.stats);
      setRecentBookings(data.recentBookings || []);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="spinner"></div>;

  const STATUS_COLORS = { pending:'warning', confirmed:'primary', completed:'success', cancelled:'danger', 'in-progress':'primary' };

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:26, fontWeight:800, color:'#1e293b', marginBottom:4 }}>Dashboard</h1>
        <p style={{ color:'#64748b' }}>Welcome back, Admin! Here's what's happening.</p>
      </div>

      {stats && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16, marginBottom:28 }}>
          <StatCard icon="👥" label="Total Users" value={stats.totalUsers.toLocaleString()} color="#4f46e5" />
          <StatCard icon="🔧" label="Active Workers" value={stats.totalWorkers.toLocaleString()} color="#10b981" />
          <StatCard icon="📋" label="Total Bookings" value={stats.totalBookings.toLocaleString()} color="#f59e0b" sub={`${stats.pendingBookings} pending`} />
          <StatCard icon="✅" label="Completed Jobs" value={stats.completedBookings.toLocaleString()} color="#22c55e" />
          <StatCard icon="💰" label="Revenue" value={`৳${(stats.totalRevenue || 0).toLocaleString()}`} color="#4f46e5" />
          <StatCard icon="📨" label="Messages" value={stats.totalContacts} color="#ec4899" sub={`${stats.newContacts} new`} />
        </div>
      )}

      <div className="card" style={{ overflow:'hidden' }}>
        <div style={{ padding:'18px 20px', borderBottom:'1px solid #f1f5f9', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <h2 style={{ fontWeight:700, fontSize:16, color:'#1e293b' }}>Recent Bookings</h2>
        </div>
        {recentBookings.length === 0 ? (
          <p style={{ textAlign:'center', padding:32, color:'#64748b' }}>No bookings yet</p>
        ) : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>ID</th><th>Client</th><th>Service</th><th>Worker</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontFamily:'monospace', fontSize:12 }}>#{b.bookingId?.slice(-6)}</td>
                    <td>{b.clientName || b.client?.name}</td>
                    <td>{b.serviceType}</td>
                    <td>{b.worker?.name}</td>
                    <td>{new Date(b.scheduledDate).toLocaleDateString()}</td>
                    <td style={{ fontWeight:700 }}>৳{b.estimatedCost || 0}</td>
                    <td><span className={`badge badge-${STATUS_COLORS[b.status] || 'gray'}`}>{b.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
