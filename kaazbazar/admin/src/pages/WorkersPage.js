import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function WorkersPage() {
  const [workers, setWorkers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const { data } = await API.get(`/admin/workers?page=${page}&search=${search}&limit=20`);
      setWorkers(data.workers || []);
      setTotal(data.total || 0);
    } catch { toast.error('Failed to load'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchWorkers(); }, [page, search]);

  const verify = async (id) => {
    try {
      await API.patch(`/admin/workers/${id}/verify`);
      setWorkers(prev => prev.map(w => w._id === id ? { ...w, isVerified: true } : w));
      toast.success('Worker verified!');
    } catch { toast.error('Failed'); }
  };

  const toggleFeatured = async (id) => {
    try {
      const { data } = await API.patch(`/admin/workers/${id}/featured`);
      setWorkers(prev => prev.map(w => w._id === id ? { ...w, isFeatured: data.worker.isFeatured } : w));
      toast.success('Updated!');
    } catch { toast.error('Failed'); }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Remove this worker?')) return;
    try {
      await API.delete(`/admin/workers/${id}`);
      setWorkers(prev => prev.filter(w => w._id !== id));
      toast.success('Worker removed');
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Workers</h1>
          <p style={{ color:'#64748b' }}>{total} total workers</p>
        </div>
        <input placeholder="Search workers..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, width:240, background:'white' }} />
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {loading ? <div className="spinner"></div> : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>Worker</th><th>Category</th><th>Location</th><th>Rating</th><th>Jobs</th><th>Rate</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {workers.map(w => (
                  <tr key={w._id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{w.name}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{w.user?.email}</div>
                    </td>
                    <td>{w.category}</td>
                    <td>{w.location?.district}</td>
                    <td>⭐ {w.rating?.toFixed(1) || '0.0'} ({w.totalReviews})</td>
                    <td>{w.totalJobs}</td>
                    <td>৳{w.hourlyRate}</td>
                    <td>
                      <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                        {w.isVerified ? <span className="badge badge-success">✓ Verified</span> : <span className="badge badge-warning">Unverified</span>}
                        {w.isFeatured && <span className="badge badge-primary">⭐ Featured</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display:'flex', gap:6 }}>
                        {!w.isVerified && <button onClick={() => verify(w._id)} style={{ padding:'5px 10px', background:'#d1fae5', color:'#065f46', borderRadius:6, fontSize:12, fontWeight:600 }}>Verify</button>}
                        <button onClick={() => toggleFeatured(w._id)} style={{ padding:'5px 10px', background:'#fef3c7', color:'#92400e', borderRadius:6, fontSize:12, fontWeight:600 }}>
                          {w.isFeatured ? 'Unfeature' : 'Feature'}
                        </button>
                        <button onClick={() => deactivate(w._id)} style={{ padding:'5px 10px', background:'#fee2e2', color:'#991b1b', borderRadius:6, fontSize:12, fontWeight:600 }}>Remove</button>
                      </div>
                    </td>
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
