import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../utils/api';

export default function WorkerProfilePage() {
  const { id } = useParams();
  const [worker, setWorker] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [wRes, rRes] = await Promise.all([
          API.get(`/workers/${id}`),
          API.get(`/reviews/worker/${id}`)
        ]);
        setWorker(wRes.data.worker);
        setReviews(rRes.data.reviews || []);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [id]);

  if (loading) return <div style={{ textAlign:'center', padding:80 }}><div className="spinner"></div></div>;
  if (!worker) return <div style={{ textAlign:'center', padding:80 }}><h2>Worker not found</h2><Link to="/workers">Back to workers</Link></div>;

  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(worker.rating || 0));

  return (
    <div style={{ maxWidth:1000, margin:'0 auto', padding:'32px 20px' }}>
      {/* Profile Header */}
      <div className="card" style={{ overflow:'hidden', marginBottom:24 }}>
        <div style={{ background:'linear-gradient(135deg,#312e81,#4f46e5)', height:140 }}></div>
        <div style={{ padding:'0 32px 32px', position:'relative' }}>
          <div style={{ display:'flex', flexWrap:'wrap', gap:20, alignItems:'flex-end' }}>
            <div style={{ width:100, height:100, borderRadius:'50%', border:'4px solid white', background:'linear-gradient(135deg,#818cf8,#a78bfa)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:40, fontWeight:700, color:'white', marginTop:-50, boxShadow:'0 8px 20px rgba(0,0,0,0.2)' }}>
              {worker.avatar ? <img src={worker.avatar} alt={worker.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} /> : worker.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginTop:12 }}>
                <h1 style={{ fontSize:28, fontWeight:800, color:'#1e293b' }}>{worker.name}</h1>
                {worker.isVerified && <span style={{ background:'#d1fae5', color:'#065f46', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:100 }}>✓ Verified</span>}
                {worker.isFeatured && <span style={{ background:'#fef3c7', color:'#92400e', fontSize:12, fontWeight:700, padding:'4px 10px', borderRadius:100 }}>⭐ Featured</span>}
              </div>
              <p style={{ color:'#4f46e5', fontWeight:600, fontSize:16, marginTop:4 }}>{worker.category} • {worker.title}</p>
              <p style={{ color:'#64748b', marginTop:4 }}>📍 {worker.location?.district}{worker.location?.area ? `, ${worker.location.area}` : ''}</p>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ fontSize:32, fontWeight:800, color:'#1e293b' }}>৳{worker.hourlyRate}/hr</div>
              <Link to={`/hire/${worker._id}`} style={{ display:'inline-block', marginTop:8, padding:'12px 28px', background:'#4f46e5', color:'white', borderRadius:10, fontWeight:700, textDecoration:'none', fontSize:15 }}>
                📋 Book Now
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', gap:24, flexWrap:'wrap' }}>
        {/* Main Content */}
        <div style={{ minWidth:0 }}>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16, marginBottom:24 }}>
            {[
              { label:'Rating', value: <span>{worker.rating?.toFixed(1) || '0.0'} <span style={{ color:'#f59e0b' }}>★</span></span> },
              { label:'Reviews', value: worker.totalReviews || 0 },
              { label:'Jobs Done', value: worker.totalJobs || 0 },
              { label:'Experience', value: `${worker.experience || 0} yrs` }
            ].map(({ label, value }) => (
              <div key={label} className="card" style={{ padding:16, textAlign:'center' }}>
                <div style={{ fontSize:22, fontWeight:800, color:'#1e293b' }}>{value}</div>
                <div style={{ color:'#64748b', fontSize:13, marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>

          {/* About */}
          {worker.bio && (
            <div className="card" style={{ padding:24, marginBottom:24 }}>
              <h2 style={{ fontWeight:700, fontSize:18, marginBottom:12 }}>About</h2>
              <p style={{ color:'#475569', lineHeight:1.8 }}>{worker.bio}</p>
            </div>
          )}

          {/* Skills */}
          {worker.skills?.length > 0 && (
            <div className="card" style={{ padding:24, marginBottom:24 }}>
              <h2 style={{ fontWeight:700, fontSize:18, marginBottom:12 }}>Skills</h2>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {worker.skills.map(s => (
                  <span key={s} style={{ background:'#eef2ff', color:'#4f46e5', padding:'6px 14px', borderRadius:100, fontSize:13, fontWeight:600 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div className="card" style={{ padding:24 }}>
            <h2 style={{ fontWeight:700, fontSize:18, marginBottom:16 }}>Reviews ({reviews.length})</h2>
            {reviews.length === 0 ? (
              <p style={{ color:'#64748b', textAlign:'center', padding:24 }}>No reviews yet</p>
            ) : reviews.map(r => (
              <div key={r._id} style={{ borderBottom:'1px solid #f1f5f9', paddingBottom:16, marginBottom:16 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontWeight:600, color:'#1e293b' }}>{r.clientName || r.client?.name}</span>
                  <span style={{ fontSize:13, color:'#94a3b8' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div style={{ display:'flex', gap:2, marginBottom:6 }}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} style={{ color: i < r.rating ? '#f59e0b' : '#cbd5e1', fontSize:16 }}>★</span>
                  ))}
                </div>
                <p style={{ color:'#475569', fontSize:14, lineHeight:1.7 }}>{r.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          <div className="card" style={{ padding:20, marginBottom:16 }}>
            <h3 style={{ fontWeight:700, fontSize:16, marginBottom:16 }}>Contact Info</h3>
            {worker.phone && <p style={{ fontSize:14, marginBottom:8, color:'#475569' }}>📞 {worker.phone}</p>}
            {worker.email && <p style={{ fontSize:14, marginBottom:8, color:'#475569' }}>✉️ {worker.email}</p>}
            <p style={{ fontSize:14, color:'#475569' }}>🕐 Response: {worker.responseTime}</p>
          </div>

          <div className="card" style={{ padding:20, marginBottom:16 }}>
            <h3 style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>Working Hours</h3>
            <p style={{ fontSize:13, color:'#475569' }}>⏰ {worker.workingHours?.start} - {worker.workingHours?.end}</p>
            {worker.workingHours?.days?.length > 0 && (
              <p style={{ fontSize:13, color:'#475569', marginTop:6 }}>📅 {worker.workingHours.days.join(', ')}</p>
            )}
          </div>

          {worker.languages?.length > 0 && (
            <div className="card" style={{ padding:20 }}>
              <h3 style={{ fontWeight:700, fontSize:16, marginBottom:12 }}>Languages</h3>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {worker.languages.map(l => (
                  <span key={l} style={{ background:'#f1f5f9', color:'#475569', padding:'4px 12px', borderRadius:100, fontSize:13 }}>{l}</span>
                ))}
              </div>
            </div>
          )}

          <Link to={`/hire/${worker._id}`} style={{ display:'block', marginTop:16, padding:'16px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', borderRadius:12, fontWeight:700, textDecoration:'none', fontSize:16, textAlign:'center' }}>
            📋 Book This Worker
          </Link>
        </div>
      </div>
    </div>
  );
}
