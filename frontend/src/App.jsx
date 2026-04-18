import { useEffect, useState } from "react";
import { useRAG } from "./hooks/useRAG";
import UploadPanel from "./components/UploadPanel";
import DocumentList from "./components/DocumentList";
import QueryPanel from "./components/QueryPanel";
import AnswerPanel from "./components/AnswerPanel";
import ErrorBanner from "./components/ErrorBanner";
import Loader from "./components/Loader";

export default function App() {
  const {
    documents, answer, sources, error, loading, uploadStatus,
    loadDocuments, upload, remove, query, clearError,
  } = useRAG();

  const [selectedDocId, setSelectedDocId] = useState(null);

  useEffect(() => { loadDocuments(); }, [loadDocuments]);

  const selectedDoc = documents.find((d) => d.doc_id === selectedDocId);

  return (
    <div style={s.page}>
      <header style={s.header}>
        <h1 style={s.logo}>🧠 RAG System</h1>
        <p style={s.sub}>Upload documents · Ask questions · Get AI answers with sources</p>
      </header>

      <div style={s.layout}>
        {/* Left sidebar */}
        <aside style={s.sidebar}>
          <UploadPanel onUpload={upload} loading={loading} uploadStatus={uploadStatus} />
          <DocumentList
            documents={documents}
            onDelete={remove}
            onSelect={setSelectedDocId}
            selectedId={selectedDocId}
          />
        </aside>

        {/* Main content */}
        <main style={s.main}>
          <ErrorBanner error={error} onDismiss={clearError} />
          <QueryPanel
            onQuery={(q) => query(q, selectedDocId)}
            loading={loading}
            selectedDocName={selectedDoc?.filename}
          />
          {loading && <Loader text="Retrieving and generating answer..." />}
          <AnswerPanel answer={answer} sources={sources} />
        </main>
      </div>
    </div>
  );
}

const s = {
  page:    { minHeight:"100vh", background:"#f0f4f8", fontFamily:"system-ui, sans-serif" },
  header:  { background:"linear-gradient(135deg,#667eea,#764ba2)", padding:"28px 40px", color:"#fff" },
  logo:    { margin:0, fontSize:28, fontWeight:700 },
  sub:     { margin:"6px 0 0", fontSize:14, opacity:0.85 },
  layout:  { display:"flex", gap:24, padding:"28px 40px", maxWidth:1200, margin:"0 auto" },
  sidebar: { width:320, flexShrink:0 },
  main:    { flex:1, minWidth:0 },
};
