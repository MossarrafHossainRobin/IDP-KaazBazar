import { useState, useEffect } from 'react';
import API from '../utils/api';
import toast from 'react-hot-toast';

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    API.get('/admin/contacts').then(({ data }) => setMessages(data.contacts || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const markRead = async (id) => {
    try {
      await API.patch(`/admin/contacts/${id}/read`);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, status: 'read' } : m));
    } catch { toast.error('Failed'); }
  };

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:24, fontWeight:800, marginBottom:4 }}>Contact Messages</h1>
        <p style={{ color:'#64748b' }}>{messages.filter(m => m.status === 'new').length} unread messages</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 1.5fr' : '1fr', gap:20 }}>
        <div className="card" style={{ overflow:'hidden' }}>
          {loading ? <div className="spinner"></div> : (
            <div>
              {messages.length === 0 ? <p style={{ textAlign:'center', padding:32, color:'#64748b' }}>No messages</p> : messages.map(m => (
                <div key={m._id} onClick={() => { setSelected(m); if (m.status === 'new') markRead(m._id); }}
                  style={{ padding:'14px 18px', borderBottom:'1px solid #f1f5f9', cursor:'pointer', background: selected?._id === m._id ? '#eef2ff' : 'white' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
                    <span style={{ fontWeight: m.status === 'new' ? 700 : 600, color:'#1e293b' }}>{m.name}</span>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      {m.status === 'new' && <span style={{ width:8, height:8, background:'#4f46e5', borderRadius:'50%', display:'inline-block' }}></span>}
                      <span style={{ fontSize:11, color:'#94a3b8' }}>{new Date(m.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p style={{ fontWeight:600, color:'#475569', fontSize:13, marginBottom:3 }}>{m.subject}</p>
                  <p style={{ color:'#94a3b8', fontSize:12, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{m.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {selected && (
          <div className="card" style={{ padding:24 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <h2 style={{ fontWeight:700, fontSize:18 }}>{selected.subject}</h2>
              <button onClick={() => setSelected(null)} style={{ background:'#f1f5f9', border:'none', borderRadius:8, padding:'6px 12px', color:'#475569', fontWeight:600, cursor:'pointer' }}>✕</button>
            </div>
            <div style={{ background:'#f8fafc', borderRadius:10, padding:16, marginBottom:16 }}>
              <p style={{ fontWeight:700, color:'#1e293b', marginBottom:4 }}>{selected.name}</p>
              <p style={{ color:'#64748b', fontSize:13, marginBottom:2 }}>✉️ {selected.email}</p>
              {selected.phone && <p style={{ color:'#64748b', fontSize:13 }}>📞 {selected.phone}</p>}
            </div>
            <p style={{ color:'#475569', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{selected.message}</p>
            <div style={{ marginTop:20 }}>
              <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`} style={{ padding:'11px 20px', background:'#4f46e5', color:'white', borderRadius:8, fontWeight:600, fontSize:14, display:'inline-block' }}>
                📧 Reply via Email
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
