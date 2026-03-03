import { Link } from 'react-router-dom';

export default function WorkerCard({ worker }) {
  const stars = Array.from({ length: 5 }, (_, i) => i < Math.round(worker.rating || 0));
  return (
    <div className="card" style={{ overflow:'hidden', transition:'transform 0.2s, box-shadow 0.2s', cursor:'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 20px 40px rgba(0,0,0,0.12)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=''; }}>
      <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', height:80, position:'relative' }}>
        {worker.isFeatured && (
          <span style={{ position:'absolute', top:10, right:10, background:'#f59e0b', color:'white', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:100 }}>⭐ FEATURED</span>
        )}
      </div>
      <div style={{ padding:'0 20px 20px', position:'relative' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', border:'3px solid white', background:'linear-gradient(135deg,#818cf8,#a78bfa)', marginTop:-32, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700, color:'white', boxShadow:'0 4px 10px rgba(0,0,0,0.15)' }}>
          {worker.avatar ? <img src={worker.avatar} alt={worker.name} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} /> : worker.name?.[0]?.toUpperCase()}
        </div>
        {worker.isVerified && <span style={{ position:'absolute', top:16, right:20, background:'#d1fae5', color:'#065f46', fontSize:11, fontWeight:700, padding:'3px 8px', borderRadius:100 }}>✓ Verified</span>}
        <h3 style={{ fontWeight:700, fontSize:16, marginTop:8, marginBottom:2, color:'#1e293b' }}>{worker.name}</h3>
        <p style={{ color:'#4f46e5', fontWeight:600, fontSize:13, marginBottom:6 }}>{worker.category}</p>
        <p style={{ color:'#64748b', fontSize:12, marginBottom:10 }}>📍 {worker.location?.district}</p>
        <div style={{ display:'flex', gap:1, marginBottom:8 }}>
          {stars.map((filled, i) => <span key={i} style={{ color: filled ? '#f59e0b' : '#cbd5e1', fontSize:14 }}>★</span>)}
          <span style={{ fontSize:12, color:'#64748b', marginLeft:4 }}>({worker.totalReviews || 0})</span>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:12 }}>
          <div>
            <span style={{ fontWeight:800, fontSize:18, color:'#1e293b' }}>৳{worker.hourlyRate}</span>
            <span style={{ color:'#64748b', fontSize:12 }}>/hr</span>
          </div>
          <Link to={`/workers/${worker._id}`} style={{ padding:'8px 16px', borderRadius:8, background:'#4f46e5', color:'white', fontWeight:600, fontSize:13, textDecoration:'none' }}>View Profile</Link>
        </div>
      </div>
    </div>
  );
}
