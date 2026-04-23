import React, { useState, useEffect } from "react";
import "./DataCollection.css";

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

const DataCollection = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showPreview, setShowPreview] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);
  useEffect(() => {
    console.log("ENV VARIABLES:", import.meta.env);
    console.log("API_BASE:", API_BASE);

    if (!API_BASE) {
      console.error("API_BASE is undefined. Check Vercel env variables.");
    }
  }, []);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!API_BASE) {
      console.error("Backend URL not defined");
      return;
    }

    console.log("Selected file:", file);

    setShowPreview(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      console.log("Sending request to:", `${API_BASE}/upload/`);

      const res = await fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Server error:", errorText);
        throw new Error("Upload failed");
      }

      const data = await res.json();
      console.log("Upload success:", data);

      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 100);

    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-indicator">
          Offline Mode — Changes saved locally
        </div>
      )}

      <div className="container">
        <header>
          <h1>Smart Resource Allocation System</h1>
          <p>Data Collection Module — Step 1</p>
        </header>

        <h2>File Upload</h2>

        <input
          type="file"
          onChange={handleFile}
          style={{ display: "none" }}
          id="fileInput"
        />

        <div
          className="upload-area"
          onClick={() => document.getElementById("fileInput").click()}
        >
          <p>Click to upload file</p>
          <button>Select File</button>
        </div>

        {showPreview && (
          <div className="preview-section">
            <h3>Uploading...</h3>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataCollection;
