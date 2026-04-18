import { useState, useCallback } from "react";
import { uploadDocument, fetchDocuments, deleteDocument, queryRAG } from "../api/client";

export function useRAG() {
  const [documents, setDocuments] = useState([]);
  const [answer, setAnswer] = useState(null);
  const [sources, setSources] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);

  const clearError = () => setError(null);

  const loadDocuments = useCallback(async () => {
    try {
      const data = await fetchDocuments();
      setDocuments(data.documents);
    } catch (err) {
      setError(err);
    }
  }, []);

  const upload = useCallback(async (file) => {
    setUploadStatus(null);
    setError(null);
    setLoading(true);
    try {
      const data = await uploadDocument(file);
      setUploadStatus(data);
      await loadDocuments();
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [loadDocuments]);

  const remove = useCallback(async (docId) => {
    setError(null);
    try {
      await deleteDocument(docId);
      setDocuments((prev) => prev.filter((d) => d.doc_id !== docId));
    } catch (err) {
      setError(err);
    }
  }, []);

  const query = useCallback(async (question, docId) => {
    setAnswer(null);
    setSources([]);
    setError(null);
    setLoading(true);
    try {
      const data = await queryRAG(question, docId || null);
      setAnswer(data.answer);
      setSources(data.sources);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    documents, answer, sources, error, loading, uploadStatus,
    loadDocuments, upload, remove, query, clearError,
  };
}
