import { Link, useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path:'/', icon:'📊', label:'Dashboard' },
  { path:'/workers', icon:'🔧', label:'Workers' },
  { path:'/users', icon:'👤', label:'Users' },
  { path:'/bookings', icon:'📋', label:'Bookings' },
  { path:'/messages', icon:'📨', label:'Messages' },
];

export default function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/login');
  };

  return (
    <aside style={{ width:240, background:'#0f172a', position:'fixed', top:0, left:0, height:'100vh', display:'flex', flexDirection:'column', zIndex:50, overflow:'auto' }}>
      <div style={{ padding:'24px 20px', borderBottom:'1px solid #1e293b' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, background:'linear-gradient(135deg,#4f46e5,#7c3aed)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:'white' }}>K</div>
          <div>
            <div style={{ fontWeight:800, fontSize:16, color:'white' }}>KaazBazar</div>
            <div style={{ fontSize:11, color:'#94a3b8' }}>Admin Panel</div>
          </div>
        </div>
      </div>

      <nav style={{ flex:1, padding:'16px 12px' }}>
        {navItems.map(({ path, icon, label }) => (
          <Link key={path} to={path} style={{
            display:'flex', alignItems:'center', gap:12, padding:'11px 14px',
            borderRadius:10, marginBottom:4, fontWeight:500, fontSize:14, transition:'all 0.15s',
            background: pathname === path ? 'rgba(79,70,229,0.2)' : 'transparent',
            color: pathname === path ? '#818cf8' : '#94a3b8',
            borderLeft: pathname === path ? '3px solid #4f46e5' : '3px solid transparent'
          }}>
            <span style={{ fontSize:18 }}>{icon}</span>
            {label}
          </Link>
        ))}
      </nav>

      <div style={{ padding:'16px 12px', borderTop:'1px solid #1e293b' }}>
        <button onClick={handleLogout} style={{ width:'100%', padding:'11px 14px', borderRadius:10, background:'rgba(239,68,68,0.1)', color:'#fca5a5', fontWeight:600, fontSize:14, border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:10 }}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
}
