import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

const STATUS = { pending:'warning', confirmed:'primary', 'in-progress':'primary', completed:'success', cancelled:'danger', rejected:'danger' };

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    API.get(`/admin/bookings?page=${page}&status=${status}&limit=20`)
      .then(({ data }) => { setBookings(data.bookings || []); setTotal(data.total || 0); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [page, status]);

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Bookings</h1>
          <p style={{ color:'#64748b' }}>{total} total bookings</p>
        </div>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:8, background:'white', fontSize:14 }}>
          <option value="">All Status</option>
          {['pending','confirmed','in-progress','completed','cancelled','rejected'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {loading ? <div className="spinner"></div> : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Booking ID</th><th>Client</th><th>Service</th><th>Worker</th><th>Date</th><th>District</th><th>Amount</th><th>Payment</th><th>Status</th></tr></thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b._id}>
                    <td style={{ fontFamily:'monospace', fontSize:12, color:'#4f46e5', fontWeight:700 }}>#{b.bookingId?.slice(-8)}</td>
                    <td>
                      <div style={{ fontWeight:600 }}>{b.clientName || b.client?.name}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{b.clientPhone}</div>
                    </td>
                    <td>{b.serviceType}</td>
                    <td>{b.worker?.name || '-'}</td>
                    <td style={{ fontSize:12 }}>{new Date(b.scheduledDate).toLocaleDateString()} {b.scheduledTime}</td>
                    <td>{b.district || '-'}</td>
                    <td style={{ fontWeight:700 }}>৳{b.estimatedCost || b.totalAmount || 0}</td>
                    <td><span className={`badge badge-${b.paymentStatus === 'paid' ? 'success' : 'warning'}`}>{b.paymentStatus}</span></td>
                    <td><span className={`badge badge-${STATUS[b.status] || 'gray'}`}>{b.status}</span></td>
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
