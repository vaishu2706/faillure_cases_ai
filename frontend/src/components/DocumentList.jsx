export default function DocumentList({ documents, onDelete, onSelect, selectedId }) {
  if (!documents.length) {
    return <p style={s.empty}>No documents uploaded yet.</p>;
  }

  return (
    <div style={s.card}>
      <h3 style={s.title}>📚 Uploaded Documents</h3>
      <ul style={s.list}>
        {documents.map((doc) => (
          <li
            key={doc.doc_id}
            style={{ ...s.item, ...(selectedId === doc.doc_id ? s.selected : {}) }}
          >
            <button style={s.nameBtn} onClick={() => onSelect(doc.doc_id === selectedId ? null : doc.doc_id)}>
              <span style={s.filename}>{doc.filename}</span>
              <span style={s.meta}>{doc.chunk_count} chunks</span>
            </button>
            <button style={s.deleteBtn} onClick={() => onDelete(doc.doc_id)} title="Delete">🗑️</button>
          </li>
        ))}
      </ul>
      {selectedId && <p style={s.filterNote}>🔎 Querying only selected document. Click again to deselect.</p>}
    </div>
  );
}

const s = {
  card:       { background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:20, marginBottom:20 },
  title:      { margin:"0 0 12px", fontSize:16, color:"#2d3748" },
  list:       { listStyle:"none", margin:0, padding:0, display:"flex", flexDirection:"column", gap:6 },
  item:       { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"8px 10px", borderRadius:6, border:"1px solid #e2e8f0", background:"#f7fafc" },
  selected:   { borderColor:"#667eea", background:"#ebf4ff" },
  nameBtn:    { background:"none", border:"none", cursor:"pointer", textAlign:"left", flex:1, display:"flex", flexDirection:"column", gap:2 },
  filename:   { fontSize:13, fontWeight:600, color:"#2d3748" },
  meta:       { fontSize:11, color:"#718096" },
  deleteBtn:  { background:"none", border:"none", cursor:"pointer", fontSize:16, padding:"0 4px" },
  empty:      { color:"#a0aec0", fontSize:13, textAlign:"center", padding:"12px 0" },
  filterNote: { marginTop:8, fontSize:12, color:"#667eea" },
};
