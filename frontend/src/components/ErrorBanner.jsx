const ERROR_MAP = {
  no_document:        { icon: "📄", label: "No Document Found" },
  no_chunks_retrieved:{ icon: "🔍", label: "No Relevant Content" },
  llm_timeout:        { icon: "⏱️", label: "AI Timed Out" },
  llm_api_failure:    { icon: "🤖", label: "AI API Error" },
  llm_auth_failure:   { icon: "🔑", label: "Invalid API Key" },
  llm_rate_limit:     { icon: "🚦", label: "Rate Limit Reached" },
  unsupported_file:   { icon: "📎", label: "Unsupported File Type" },
  empty_document:     { icon: "📭", label: "Empty Document" },
  embedding_failure:  { icon: "⚙️", label: "Embedding Failed" },
  network_failure:    { icon: "🌐", label: "Network Error" },
};

export default function ErrorBanner({ error, onDismiss }) {
  if (!error) return null;
  const meta = ERROR_MAP[error.error] || { icon: "❌", label: "Error" };

  return (
    <div style={s.banner}>
      <span style={s.icon}>{meta.icon}</span>
      <div style={s.body}>
        <strong style={s.label}>{meta.label}</strong>
        <p style={s.msg}>{error.message}</p>
        {error.detail && <p style={s.detail}>{error.detail}</p>}
      </div>
      <button style={s.close} onClick={onDismiss}>✕</button>
    </div>
  );
}

const s = {
  banner: { display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px", background:"#fff5f5", border:"1px solid #feb2b2", borderRadius:8, marginBottom:16 },
  icon:   { fontSize:22, lineHeight:1 },
  body:   { flex:1 },
  label:  { color:"#c53030", fontSize:14 },
  msg:    { margin:"2px 0 0", color:"#742a2a", fontSize:13 },
  detail: { margin:"2px 0 0", color:"#9b2c2c", fontSize:12, fontStyle:"italic" },
  close:  { background:"none", border:"none", cursor:"pointer", color:"#c53030", fontSize:16, padding:0 },
};
