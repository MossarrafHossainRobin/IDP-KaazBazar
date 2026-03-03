import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background:'#0f172a', color:'#94a3b8', marginTop:'auto' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'50px 20px 20px' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:40, marginBottom:40 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
              <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18 }}>K</div>
              <span style={{ fontWeight:800, fontSize:20, color:'white' }}>Kaaz<span style={{ color:'#818cf8' }}>Bazar</span></span>
            </div>
            <p style={{ fontSize:14, lineHeight:1.7 }}>Find trusted local service workers across all 64 districts of Bangladesh. Quality service at your doorstep.</p>
          </div>
          <div>
            <h4 style={{ color:'white', fontWeight:700, marginBottom:16, fontSize:15 }}>Quick Links</h4>
            {[['/', 'Home'],['/workers','Find Workers'],['/about','About Us'],['/contact','Contact']].map(([path,label]) => (
              <Link key={path} to={path} style={{ display:'block', color:'#94a3b8', textDecoration:'none', marginBottom:8, fontSize:14, transition:'color 0.2s' }}
                onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{label}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color:'white', fontWeight:700, marginBottom:16, fontSize:15 }}>Services</h4>
            {['Plumber','Electrician','Carpenter','Cleaner','Painter','Technician'].map(s => (
              <Link key={s} to={`/category/${s}`} style={{ display:'block', color:'#94a3b8', textDecoration:'none', marginBottom:8, fontSize:14 }}
                onMouseEnter={e => e.target.style.color='#818cf8'} onMouseLeave={e => e.target.style.color='#94a3b8'}>{s}</Link>
            ))}
          </div>
          <div>
            <h4 style={{ color:'white', fontWeight:700, marginBottom:16, fontSize:15 }}>Contact</h4>
            <p style={{ fontSize:14, marginBottom:8 }}>📧 support@kaazbazar.com</p>
            <p style={{ fontSize:14, marginBottom:8 }}>📞 +880 1700-000000</p>
            <p style={{ fontSize:14, marginBottom:8 }}>📍 Dhaka, Bangladesh</p>
            <p style={{ fontSize:13, marginTop:16 }}>Available 8AM - 8PM, 7 days a week</p>
          </div>
        </div>
        <div style={{ borderTop:'1px solid #1e293b', paddingTop:20, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, fontSize:13 }}>
          <p>© 2025 KaazBazar. All rights reserved.</p>
          <div style={{ display:'flex', gap:20 }}>
            <Link to="/privacy" style={{ color:'#94a3b8', textDecoration:'none' }}>Privacy Policy</Link>
            <Link to="/terms" style={{ color:'#94a3b8', textDecoration:'none' }}>Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
