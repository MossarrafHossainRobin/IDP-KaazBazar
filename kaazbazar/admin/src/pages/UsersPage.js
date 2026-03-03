import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    setLoading(true);
    API.get(`/admin/users?search=${search}&role=${role}&limit=30`)
      .then(({ data }) => { setUsers(data.users || []); setTotal(data.total || 0); })
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false));
  }, [search, role]);

  const toggleActive = async (id) => {
    try {
      const { data } = await API.patch(`/admin/users/${id}/toggle`);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: data.user.isActive } : u));
      toast.success(data.message);
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24, flexWrap:'wrap', gap:12 }}>
        <div>
          <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Users</h1>
          <p style={{ color:'#64748b' }}>{total} registered users</p>
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <select value={role} onChange={e => setRole(e.target.value)} style={{ padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:8, background:'white', fontSize:14 }}>
            <option value="">All Roles</option>
            <option value="user">Customers</option>
            <option value="worker">Workers</option>
            <option value="admin">Admins</option>
          </select>
          <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ padding:'10px 14px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14, background:'white', width:220 }} />
        </div>
      </div>

      <div className="card" style={{ overflow:'hidden' }}>
        {loading ? <div className="spinner"></div> : (
          <div style={{ overflowX:'auto' }}>
            <table>
              <thead><tr><th>User</th><th>Phone</th><th>District</th><th>Role</th><th>Joined</th><th>Status</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ fontWeight:600 }}>{u.name}</div>
                      <div style={{ fontSize:12, color:'#64748b' }}>{u.email}</div>
                    </td>
                    <td>{u.phone || '-'}</td>
                    <td>{u.district || '-'}</td>
                    <td><span className={`badge badge-${u.role==='admin'?'danger':u.role==='worker'?'primary':'gray'}`}>{u.role}</span></td>
                    <td style={{ fontSize:12 }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge badge-${u.isActive?'success':'danger'}`}>{u.isActive ? 'Active' : 'Suspended'}</span></td>
                    <td>
                      <button onClick={() => toggleActive(u._id)} style={{ padding:'5px 12px', background: u.isActive ? '#fee2e2' : '#d1fae5', color: u.isActive ? '#991b1b' : '#065f46', borderRadius:6, fontSize:12, fontWeight:600 }}>
                        {u.isActive ? 'Suspend' : 'Activate'}
                      </button>
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
