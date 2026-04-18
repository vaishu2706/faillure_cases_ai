import { useState } from "react";

export default function QueryPanel({ onQuery, loading, selectedDocName }) {
  const [question, setQuestion] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (question.trim()) onQuery(question.trim());
  }

  return (
    <div style={s.card}>
      <h3 style={s.title}>💬 Ask a Question</h3>
      {selectedDocName && (
        <p style={s.scope}>Searching in: <strong>{selectedDocName}</strong></p>
      )}
      <form onSubmit={handleSubmit} style={s.form}>
        <textarea
          style={s.textarea}
          rows={3}
          placeholder="Ask anything about your documents..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSubmit(e); } }}
        />
        <button type="submit" disabled={loading || !question.trim()} style={s.btn}>
          {loading ? "Thinking..." : "Ask AI ✨"}
        </button>
      </form>
    </div>
  );
}

const s = {
  card:     { background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:20, marginBottom:20 },
  title:    { margin:"0 0 8px", fontSize:16, color:"#2d3748" },
  scope:    { margin:"0 0 10px", fontSize:12, color:"#667eea" },
  form:     { display:"flex", flexDirection:"column", gap:10 },
  textarea: { padding:"10px 12px", fontSize:14, borderRadius:6, border:"1px solid #cbd5e0", resize:"vertical", fontFamily:"inherit", outline:"none" },
  btn:      { padding:"10px 20px", background:"#667eea", color:"#fff", border:"none", borderRadius:6, cursor:"pointer", fontSize:14, fontWeight:600, transition:"opacity 0.2s", opacity:1 },
};
