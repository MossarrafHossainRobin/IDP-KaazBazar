import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../utils/api';
import WorkerCard from '../components/WorkerCard';
import { CATEGORIES, DISTRICTS } from '../utils/constants';

export default function HomePage() {
  const [featuredWorkers, setFeaturedWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchCategory, setSearchCategory] = useState('');
  const [searchDistrict, setSearchDistrict] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wRes, cRes] = await Promise.all([
          API.get('/workers/featured/list'),
          API.get('/categories')
        ]);
        setFeaturedWorkers(wRes.data.workers || []);
        setCategories(cRes.data.categories || CATEGORIES);
      } catch (err) {
        setCategories(CATEGORIES);
      } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchCategory) params.set('category', searchCategory);
    if (searchDistrict) params.set('district', searchDistrict);
    navigate(`/workers?${params.toString()}`);
  };

  return (
    <div>
      {/* HERO */}
      <section style={{ background:'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #4f46e5 100%)', color:'white', padding:'80px 20px' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <div style={{ display:'inline-block', background:'rgba(255,255,255,0.1)', borderRadius:100, padding:'6px 16px', fontSize:13, fontWeight:600, marginBottom:20, border:'1px solid rgba(255,255,255,0.2)' }}>
            🇧🇩 Serving all 64 Districts of Bangladesh
          </div>
          <h1 style={{ fontSize:'clamp(32px, 6vw, 60px)', fontWeight:800, lineHeight:1.1, marginBottom:20 }}>
            Find Trusted Local<br /><span style={{ color:'#fbbf24' }}>Service Workers</span>
          </h1>
          <p style={{ fontSize:'clamp(15px, 2vw, 20px)', opacity:0.85, marginBottom:40, maxWidth:600, margin:'0 auto 40px' }}>
            Connect with verified plumbers, electricians, carpenters and more. Quality service at your doorstep.
          </p>

          {/* Search Bar */}
          <div style={{ background:'white', borderRadius:16, padding:8, display:'flex', gap:8, flexWrap:'wrap', maxWidth:700, margin:'0 auto', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' }}>
            <select value={searchCategory} onChange={e => setSearchCategory(e.target.value)}
              style={{ flex:'1 1 150px', padding:'12px 16px', border:'1px solid #e2e8f0', borderRadius:10, fontSize:14, color:'#475569', background:'white' }}>
              <option value="">All Services</option>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
            <select value={searchDistrict} onChange={e => setSearchDistrict(e.target.value)}
              style={{ flex:'1 1 150px', padding:'12px 16px', border:'1px solid #e2e8f0', borderRadius:10, fontSize:14, color:'#475569', background:'white' }}>
              <option value="">All Districts</option>
              {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <button onClick={handleSearch} style={{ flex:'0 0 auto', padding:'12px 28px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', border:'none', borderRadius:10, fontWeight:700, fontSize:15, cursor:'pointer' }}>
              🔍 Search
            </button>
          </div>

          <div style={{ display:'flex', gap:30, justifyContent:'center', marginTop:40, flexWrap:'wrap' }}>
            {[['10,000+','Workers Available'],['64','Districts Covered'],['50,000+','Happy Customers']].map(([num, label]) => (
              <div key={label} style={{ textAlign:'center' }}>
                <div style={{ fontSize:28, fontWeight:800, color:'#fbbf24' }}>{num}</div>
                <div style={{ fontSize:13, opacity:0.8 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ padding:'70px 20px', background:'white' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:48 }}>
            <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#1e293b', marginBottom:12 }}>Popular Services</h2>
            <p style={{ color:'#64748b', fontSize:16, maxWidth:500, margin:'0 auto' }}>Browse through our wide range of professional service categories</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(160px, 1fr))', gap:16 }}>
            {(categories.length ? categories : CATEGORIES).map(cat => (
              <Link key={cat.id} to={`/category/${cat.id}`} style={{
                background:'white', borderRadius:16, padding:'24px 16px', textAlign:'center',
                border:'1px solid #e2e8f0', textDecoration:'none', transition:'all 0.2s', display:'block'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor='#4f46e5'; e.currentTarget.style.boxShadow='0 10px 30px rgba(79,70,229,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform=''; e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.boxShadow=''; }}>
                <div style={{ fontSize:36, marginBottom:10 }}>{cat.icon}</div>
                <div style={{ fontWeight:700, color:'#1e293b', fontSize:14, marginBottom:4 }}>{cat.name}</div>
                {cat.workerCount !== undefined && <div style={{ color:'#64748b', fontSize:12 }}>{cat.workerCount} workers</div>}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED WORKERS */}
      {!loading && featuredWorkers.length > 0 && (
        <section style={{ padding:'70px 20px', background:'#f8fafc' }}>
          <div style={{ maxWidth:1280, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom:48 }}>
              <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#1e293b', marginBottom:12 }}>Featured Workers</h2>
              <p style={{ color:'#64748b', fontSize:16 }}>Top-rated professionals trusted by thousands of customers</p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(280px, 1fr))', gap:24 }}>
              {featuredWorkers.slice(0,8).map(w => <WorkerCard key={w._id} worker={w} />)}
            </div>
            <div style={{ textAlign:'center', marginTop:40 }}>
              <Link to="/workers" style={{ padding:'14px 32px', background:'#4f46e5', color:'white', borderRadius:10, fontWeight:700, textDecoration:'none', fontSize:15 }}>
                View All Workers →
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* HOW IT WORKS */}
      <section style={{ padding:'70px 20px', background:'white' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, color:'#1e293b', marginBottom:12 }}>How It Works</h2>
          <p style={{ color:'#64748b', fontSize:16, marginBottom:48 }}>Get quality service in just 3 simple steps</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:32 }}>
            {[
              { step:'1', icon:'🔍', title:'Search a Worker', desc:'Browse workers by category and district. Filter by ratings and price.' },
              { step:'2', icon:'📋', title:'Book a Service', desc:'Choose a time slot and provide your address. Worker gets notified instantly.' },
              { step:'3', icon:'✅', title:'Get it Done', desc:'Worker arrives on time, completes the job. Pay when satisfied.' }
            ].map(({ step, icon, title, desc }) => (
              <div key={step} style={{ textAlign:'center', padding:32, borderRadius:16, border:'1px solid #e2e8f0' }}>
                <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', fontWeight:800, fontSize:20, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>{step}</div>
                <div style={{ fontSize:32, marginBottom:12 }}>{icon}</div>
                <h3 style={{ fontWeight:700, fontSize:18, color:'#1e293b', marginBottom:8 }}>{title}</h3>
                <p style={{ color:'#64748b', fontSize:14, lineHeight:1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', padding:'70px 20px', textAlign:'center', color:'white' }}>
        <h2 style={{ fontSize:'clamp(24px,4vw,40px)', fontWeight:800, marginBottom:16 }}>Are You a Service Professional?</h2>
        <p style={{ fontSize:18, opacity:0.9, marginBottom:32, maxWidth:500, margin:'0 auto 32px' }}>Join KaazBazar and connect with thousands of customers looking for your skills</p>
        <Link to="/register" style={{ padding:'16px 36px', background:'#fbbf24', color:'#1e293b', borderRadius:12, fontWeight:800, fontSize:16, textDecoration:'none', display:'inline-block' }}>
          Register as a Worker →
        </Link>
      </section>
    </div>
  );
}
