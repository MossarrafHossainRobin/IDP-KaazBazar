import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../utils/api';
import WorkerCard from '../components/WorkerCard';
import { CATEGORIES, DISTRICTS } from '../utils/constants';

export default function WorkersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    district: searchParams.get('district') || '',
    search: searchParams.get('search') || '',
    minRate: '', maxRate: '', rating: '',
    sort: '-rating', page: 1
  });

  useEffect(() => {
    fetchWorkers();
  }, [filters]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => { if (v) params.set(k, v); });
      const { data } = await API.get(`/workers?${params}`);
      setWorkers(data.workers || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (err) {
      setWorkers([]);
    } finally { setLoading(false); }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div style={{ maxWidth:1280, margin:'0 auto', padding:'32px 20px' }}>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:'clamp(22px,4vw,36px)', fontWeight:800, color:'#1e293b', marginBottom:6 }}>Find Service Workers</h1>
        <p style={{ color:'#64748b' }}>{total} workers available</p>
      </div>

      <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>
        {/* Filters Sidebar */}
        <div style={{ width:260, flexShrink:0 }}>
          <div className="card" style={{ padding:20, position:'sticky', top:80 }}>
            <h3 style={{ fontWeight:700, marginBottom:16, color:'#1e293b' }}>Filters</h3>
            
            <div style={{ marginBottom:16 }}>
              <input placeholder="Search by name or skill..." value={filters.search}
                onChange={e => updateFilter('search', e.target.value)}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }} />
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Category</label>
              <select value={filters.category} onChange={e => updateFilter('category', e.target.value)}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }}>
                <option value="">All Categories</option>
                {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>District</label>
              <select value={filters.district} onChange={e => updateFilter('district', e.target.value)}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }}>
                <option value="">All Districts</option>
                {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Min Rating</label>
              <select value={filters.rating} onChange={e => updateFilter('rating', e.target.value)}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }}>
                <option value="">Any Rating</option>
                <option value="4">4+ ⭐</option>
                <option value="3">3+ ⭐</option>
                <option value="2">2+ ⭐</option>
              </select>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Price Range (৳/hr)</label>
              <div style={{ display:'flex', gap:8 }}>
                <input placeholder="Min" value={filters.minRate} onChange={e => updateFilter('minRate', e.target.value)}
                  type="number" style={{ width:'50%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13 }} />
                <input placeholder="Max" value={filters.maxRate} onChange={e => updateFilter('maxRate', e.target.value)}
                  type="number" style={{ width:'50%', padding:'8px 10px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:13 }} />
              </div>
            </div>

            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:13, marginBottom:6, color:'#475569' }}>Sort By</label>
              <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)}
                style={{ width:'100%', padding:'10px 12px', border:'1px solid #e2e8f0', borderRadius:8, fontSize:14 }}>
                <option value="-rating">Highest Rated</option>
                <option value="-totalJobs">Most Jobs</option>
                <option value="hourlyRate">Price: Low to High</option>
                <option value="-hourlyRate">Price: High to Low</option>
                <option value="-createdAt">Newest</option>
              </select>
            </div>

            <button onClick={() => setFilters({ category:'', district:'', search:'', minRate:'', maxRate:'', rating:'', sort:'-rating', page:1 })}
              style={{ width:'100%', padding:'10px', borderRadius:8, border:'1px solid #e2e8f0', background:'white', color:'#64748b', cursor:'pointer', fontSize:14 }}>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Workers Grid */}
        <div style={{ flex:1, minWidth:0 }}>
          {loading ? (
            <div style={{ textAlign:'center', padding:60 }}>
              <div className="spinner"></div>
              <p style={{ color:'#64748b' }}>Loading workers...</p>
            </div>
          ) : workers.length === 0 ? (
            <div style={{ textAlign:'center', padding:80, background:'white', borderRadius:16, border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:48, marginBottom:16 }}>🔍</div>
              <h3 style={{ color:'#1e293b', fontWeight:700, marginBottom:8 }}>No workers found</h3>
              <p style={{ color:'#64748b' }}>Try adjusting your filters</p>
            </div>
          ) : (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:20 }}>
                {workers.map(w => <WorkerCard key={w._id} worker={w} />)}
              </div>
              {pages > 1 && (
                <div style={{ display:'flex', gap:8, justifyContent:'center', marginTop:32, flexWrap:'wrap' }}>
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                      style={{ width:40, height:40, borderRadius:8, border:'1px solid', borderColor: filters.page === p ? '#4f46e5' : '#e2e8f0',
                        background: filters.page === p ? '#4f46e5' : 'white', color: filters.page === p ? 'white' : '#475569',
                        fontWeight:600, cursor:'pointer' }}>{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
