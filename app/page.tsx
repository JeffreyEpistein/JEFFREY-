
"use client";

import { useState } from "react";

type Result = {
  projectId: string;
  keyStatus: string;
  projectStatus: string;
  registeredDevices: number;
  activeDevices: number;
  message?: string;
};

export default function Home() {
  const [keys, setKeys] = useState("");
  const [password, setPassword] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file?: File) {
    if (!file) return;
    setKeys(await file.text());
  }

  async function checkProjects() {
    setError("");
    setResults([]);

    const entries = keys.split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const [apiKey, projectId] = line.split("|").map(x => x.trim());
        return { apiKey, projectId };
      })
      .filter(item => item.apiKey && item.projectId);

    if (!entries.length) {
      setError("Enter API keys in API_KEY | PROJECT_ID format.");
      return;
    }

    if (!password) {
      setError("Enter your panel password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entries,
          panelPassword: password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResults(data.results || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const registered = results.reduce(
    (sum, item) => sum + (Number(item.registeredDevices) || 0), 0
  );

  const active = results.reduce(
    (sum, item) => sum + (Number(item.activeDevices) || 0), 0
  );

  return (
    <main style={{
      maxWidth: 850, margin: "35px auto", padding: 20,
      fontFamily: "Arial, sans-serif", color: "#172033"
    }}>
      <h1>Firebase Bulk Checker</h1>
      <p>Authorized project status dashboard</p>

      <h3>Firebase API Keys</h3>
      <textarea
        value={keys}
        onChange={e => setKeys(e.target.value)}
        placeholder={"API_KEY_1 | PROJECT_ID_1\nAPI_KEY_2 | PROJECT_ID_2"}
        rows={8}
        style={{ width: "100%", padding: 12, boxSizing: "border-box" }}
      />

      <p>Or upload a TXT / CSV file:</p>
      <input
        type="file"
        accept=".txt,.csv"
        onChange={e => uploadFile(e.target.files?.[0])}
      />

      <h3>Panel Password</h3>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Your own panel password"
        style={{ width: "100%", padding: 12, boxSizing: "border-box" }}
      />

      <button
        onClick={checkProjects}
        disabled={loading}
        style={{
          marginTop: 20, padding: "13px 22px",
          background: "#1769e0", color: "white",
          border: 0, borderRadius: 7, fontSize: 16
        }}
      >
        {loading ? "Checking..." : "Check Projects"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {results.length > 0 && (
        <>
          <h2>Summary</h2>
          <p>Projects checked: {results.length}</p>
          <p>Registered devices: {registered}</p>
          <p>Active devices: {active}</p>

          <h2>Results</h2>
          {results.map((item, index) => (
            <section key={index} style={{
              border: "1px solid #ddd", borderRadius: 8,
              padding: 14, marginBottom: 12
            }}>
              <strong>{item.projectId}</strong>
              <p>Key status: {item.keyStatus}</p>
              <p>Project status: {item.projectStatus}</p>
              <p>Registered devices: {item.registeredDevices}</p>
              <p>Active devices: {item.activeDevices}</p>
              {item.message && <p>{item.message}</p>}
            </section>
          ))}
        </>
      )}
    </main>
  );
}
