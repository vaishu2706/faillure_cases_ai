import { useRef, useState } from "react";

const ACCEPTED = [".pdf", ".txt", ".md", ".docx"];

export default function UploadPanel({ onUpload, loading, uploadStatus }) {
  const inputRef = useRef();
  const [dragging, setDragging] = useState(false);

  function handleFiles(files) {
    if (!files.length) return;
    onUpload(files[0]);
  }

  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }

  return (
    <div style={s.card}>
      <h3 style={s.title}>📁 Upload Document</h3>
      <p style={s.hint}>Supported: PDF, TXT, MD, DOCX</p>

      <div
        style={{ ...s.dropzone, ...(dragging ? s.dragging : {}) }}
        onClick={() => inputRef.current.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
      >
        <span style={s.dropIcon}>⬆️</span>
        <span style={s.dropText}>
          {loading ? "Uploading..." : "Drag & drop or click to select"}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(",")}
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {uploadStatus && (
        <div style={s.success}>
          ✅ <strong>{uploadStatus.filename}</strong> — {uploadStatus.chunks_stored} chunks indexed
        </div>
      )}
    </div>
  );
}

const s = {
  card:     { background:"#fff", border:"1px solid #e2e8f0", borderRadius:10, padding:20, marginBottom:20 },
  title:    { margin:"0 0 4px", fontSize:16, color:"#2d3748" },
  hint:     { margin:"0 0 12px", fontSize:12, color:"#718096" },
  dropzone: { border:"2px dashed #cbd5e0", borderRadius:8, padding:"28px 20px", textAlign:"center", cursor:"pointer", transition:"all 0.2s" },
  dragging: { borderColor:"#667eea", background:"#ebf4ff" },
  dropIcon: { fontSize:28, display:"block", marginBottom:6 },
  dropText: { fontSize:13, color:"#4a5568" },
  success:  { marginTop:12, padding:"10px 14px", background:"#f0fff4", border:"1px solid #9ae6b4", borderRadius:6, fontSize:13, color:"#276749" },
};
