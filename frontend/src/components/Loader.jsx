export default function Loader({ text = "Processing..." }) {
  return (
    <div style={s.wrap}>
      <div style={s.spinner} />
      <span style={s.text}>{text}</span>
    </div>
  );
}

const spin = `
@keyframes spin { to { transform: rotate(360deg); } }
`;
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = spin;
  document.head.appendChild(style);
}

const s = {
  wrap:    { display:"flex", alignItems:"center", gap:10, padding:"12px 0", color:"#4a5568" },
  spinner: { width:20, height:20, border:"3px solid #e2e8f0", borderTop:"3px solid #667eea", borderRadius:"50%", animation:"spin 0.8s linear infinite" },
  text:    { fontSize:14 },
};
