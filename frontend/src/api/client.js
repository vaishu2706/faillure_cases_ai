const BASE = "http://localhost:8000";

async function request(path, options = {}) {
  try {
    const res = await fetch(`${BASE}${path}`, options);
    const data = await res.json();
    if (!res.ok) {
      throw { error: data.error, message: data.message, detail: data.detail };
    }
    return data;
  } catch (err) {
    if (err.error) throw err; // already typed
    throw { error: "network_failure", message: "Cannot reach the server. Is the backend running?" };
  }
}

export async function uploadDocument(file) {
  const form = new FormData();
  form.append("file", file);
  return request("/documents/upload", { method: "POST", body: form });
}

export async function fetchDocuments() {
  return request("/documents");
}

export async function deleteDocument(docId) {
  return request(`/documents/${docId}`, { method: "DELETE" });
}

export async function queryRAG(question, docId = null) {
  return request("/query", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, doc_id: docId }),
  });
}
