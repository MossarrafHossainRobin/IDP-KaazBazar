import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const isActive = (p) => loc.pathname === p;

  return (
    <nav style={{ background:'white', borderBottom:'1px solid #e2e8f0', position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(0,0,0,0.05)' }}>
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'14px 20px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none' }}>
          <div style={{ background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', width:38, height:38, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:18 }}>K</div>
          <span style={{ fontWeight:800, fontSize:20, color:'#1e293b' }}>Kaaz<span style={{ color:'#4f46e5' }}>Bazar</span></span>
        </Link>

        <div style={{ display:'flex', gap:4, alignItems:'center' }} id="desktop-nav">
          {[['/', 'Home'],['/workers','Find Workers'],['/about','About'],['/contact','Contact']].map(([path,label]) => (
            <Link key={path} to={path} style={{ padding:'8px 14px', borderRadius:8, fontWeight:500, fontSize:14, color:isActive(path)?'#4f46e5':'#475569', background:isActive(path)?'#eef2ff':'transparent', textDecoration:'none' }}>{label}</Link>
          ))}
        </div>

        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          {user ? (
            <>
              <Link to="/dashboard" style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 14px', borderRadius:8, background:'#eef2ff', color:'#4f46e5', fontWeight:600, fontSize:14, textDecoration:'none' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#4f46e5,#7c3aed)', color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, fontSize:12 }}>{user.name?.[0]?.toUpperCase()}</div>
                {user.name?.split(' ')[0]}
              </Link>
              <button onClick={() => { logout(); navigate('/'); }} style={{ padding:'8px 14px', borderRadius:8, background:'#fee2e2', color:'#ef4444', fontWeight:600, fontSize:14, border:'none', cursor:'pointer' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding:'8px 16px', borderRadius:8, border:'2px solid #4f46e5', color:'#4f46e5', fontWeight:600, fontSize:14, textDecoration:'none' }}>Login</Link>
              <Link to="/register" style={{ padding:'8px 16px', borderRadius:8, background:'#4f46e5', color:'white', fontWeight:600, fontSize:14, textDecoration:'none' }}>Register</Link>
            </>
          )}
          <button onClick={() => setMenuOpen(!menuOpen)} id="menu-btn" style={{ display:'none', padding:8, background:'transparent', border:'none', cursor:'pointer', fontSize:20 }}>☰</button>
        </div>
      </div>

      {menuOpen && (
        <div style={{ background:'white', borderTop:'1px solid #e2e8f0', padding:'16px 20px', display:'flex', flexDirection:'column', gap:4 }}>
          {[['/', 'Home'],['/workers','Find Workers'],['/about','About'],['/contact','Contact']].map(([path,label]) => (
            <Link key={path} to={path} onClick={() => setMenuOpen(false)} style={{ padding:'10px 14px', borderRadius:8, fontWeight:500, fontSize:15, color:isActive(path)?'#4f46e5':'#475569', background:isActive(path)?'#eef2ff':'transparent', textDecoration:'none' }}>{label}</Link>
          ))}
          {user && <Link to="/dashboard" onClick={() => setMenuOpen(false)} style={{ padding:'10px 14px', borderRadius:8, color:'#4f46e5', fontWeight:500, fontSize:15, textDecoration:'none' }}>Dashboard</Link>}
        </div>
      )}

      <style>{`@media(max-width:768px){ #desktop-nav{display:none!important} #menu-btn{display:block!important} }`}</style>
    </nav>
  );
}
