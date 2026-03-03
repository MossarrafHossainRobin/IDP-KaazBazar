import { Link } from 'react-router-dom';
export default function AboutPage() {
  return (
    <div>
      <section style={{ background:'linear-gradient(135deg,#1e1b4b,#4f46e5)', color:'white', padding:'80px 20px', textAlign:'center' }}>
        <div style={{ maxWidth:700, margin:'0 auto' }}>
          <h1 style={{ fontSize:'clamp(28px,5vw,52px)', fontWeight:800, marginBottom:16 }}>About <span style={{ color:'#fbbf24' }}>KaazBazar</span></h1>
          <p style={{ fontSize:18, opacity:0.9, lineHeight:1.7 }}>Connecting skilled workers with those who need them, across all 64 districts of Bangladesh</p>
        </div>
      </section>
      <section style={{ padding:'70px 20px', background:'white' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:32 }}>
            {[
              { icon:'🎯', title:'Our Mission', desc:'To bridge the gap between skilled service workers and customers across Bangladesh, providing quality, reliable service at competitive prices.' },
              { icon:'🌍', title:'Our Vision', desc:'To become Bangladesh\'s most trusted digital platform for local services, empowering workers economically while solving everyday problems for customers.' },
              { icon:'💡', title:'Our Approach', desc:'We verify workers, collect genuine reviews, and ensure transparent pricing so every transaction builds trust in our community.' }
            ].map(({ icon, title, desc }) => (
              <div key={title} style={{ padding:32, borderRadius:16, border:'1px solid #e2e8f0', textAlign:'center' }}>
                <div style={{ fontSize:48, marginBottom:16 }}>{icon}</div>
                <h3 style={{ fontWeight:700, fontSize:20, color:'#1e293b', marginBottom:12 }}>{title}</h3>
                <p style={{ color:'#64748b', lineHeight:1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding:'70px 20px', background:'#f8fafc' }}>
        <div style={{ maxWidth:900, margin:'0 auto', textAlign:'center' }}>
          <h2 style={{ fontSize:36, fontWeight:800, color:'#1e293b', marginBottom:48 }}>By the Numbers</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(160px, 1fr))', gap:24 }}>
            {[['10,000+','Workers','Registered'],['64','Districts','Covered'],['50,000+','Customers','Served'],['4.8/5','Average','Rating']].map(([num, top, bot]) => (
              <div key={num} style={{ padding:24, background:'white', borderRadius:16, boxShadow:'0 4px 12px rgba(0,0,0,0.06)' }}>
                <div style={{ fontSize:36, fontWeight:800, color:'#4f46e5', marginBottom:6 }}>{num}</div>
                <div style={{ fontWeight:600, color:'#1e293b' }}>{top}</div>
                <div style={{ color:'#64748b', fontSize:13 }}>{bot}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ padding:'70px 20px', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', textAlign:'center', color:'white' }}>
        <h2 style={{ fontSize:32, fontWeight:800, marginBottom:16 }}>Ready to Get Started?</h2>
        <p style={{ fontSize:18, opacity:0.9, marginBottom:32 }}>Find a trusted worker in your area today</p>
        <Link to="/workers" style={{ padding:'14px 32px', background:'white', color:'#4f46e5', borderRadius:10, fontWeight:700, textDecoration:'none', fontSize:15 }}>Browse Workers</Link>
      </section>
    </div>
  );
}
