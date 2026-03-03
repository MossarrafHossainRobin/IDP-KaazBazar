import { Link } from 'react-router-dom';
export default function NotFoundPage() {
  return (
    <div style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ fontSize:80 }}>🔍</div>
      <h1 style={{ fontSize:48, fontWeight:800, color:'#1e293b', marginBottom:12 }}>404</h1>
      <p style={{ color:'#64748b', fontSize:18, marginBottom:32 }}>Page not found</p>
      <Link to="/" style={{ padding:'14px 28px', background:'#4f46e5', color:'white', borderRadius:10, fontWeight:700, textDecoration:'none' }}>Go Home</Link>
    </div>
  );
}
