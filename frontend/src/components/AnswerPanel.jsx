import { useState } from "react";

export default function AnswerPanel({ answer, sources }) {
  const [expanded, setExpanded] = useState(false);
  if (!answer) return null;

  return (
    <div style={s.card}>
      <h3 style={s.title}>🤖 Answer</h3>
      <p style={s.answer}>{answer}</p>

      {sources.length > 0 && (
        <div style={s.sourcesWrap}>
          <button style={s.toggle} onClick={() => setExpanded((v) => !v)}>
            {expanded ? "▲ Hide" : "▼ Show"} {sources.length} source chunk{sources.length > 1 ? "s" : ""}
          </button>
          {expanded && (
            <div style={s.sources}>
              {sources.map((src, i) => (
                <div key={i} style={s.chunk}>
                  <div style={s.chunkMeta}>
                    📄 <strong>{src.filename}</strong> · Chunk {src.chunk_index} · Score {src.score}
                  </div>
                  <p style={s.chunkText}>{src.text}{src.text.length >= 300 ? "…" : ""}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  card:       { background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:20, marginBottom:20 },
  title:      { margin:"0 0 10px", fontSize:16, color:"#2d3748" },
  answer:     { margin:0, fontSize:14, color:"#2d3748", lineHeight:1.7, whiteSpace:"pre-wrap" },
  sourcesWrap:{ marginTop:14 },
  toggle:     { background:"none", border:"none", cursor:"pointer", color:"#667eea", fontSize:13, padding:0 },
  sources:    { marginTop:10, display:"flex", flexDirection:"column", gap:10 },
  chunk:      { padding:"10px 12px", background:"#f7fafc", border:"1px solid #e2e8f0", borderRadius:6 },
  chunkMeta:  { fontSize:12, color:"#718096", marginBottom:4 },
  chunkText:  { margin:0, fontSize:12, color:"#4a5568", lineHeight:1.6 },
};
