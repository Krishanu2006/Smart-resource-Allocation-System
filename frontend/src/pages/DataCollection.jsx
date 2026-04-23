import React, { useState, useEffect } from "react";
import "./DataCollection.css";

const API_BASE = import.meta.env.VITE_APP_BASE_URL;

const DataCollection = () => {
  const [activeTab, setActiveTab] = useState("upload"); 
  const [isOnline, setIsOnline] = useState(navigator.onLine); 
  const [isRecording, setIsRecording] = useState(false); 
  const [showPreview, setShowPreview] = useState(false); 
  const [progress, setProgress] = useState(0); 
  const [transcript, setTranscript] = useState("");

  useEffect(() => { 
    const updateStatus = () => setIsOnline(navigator.onLine); 
    window.addEventListener("online", updateStatus); 
    window.addEventListener("offline", updateStatus); 

    return () => { 
      window.removeEventListener("online", updateStatus); 
      window.removeEventListener("offline", updateStatus); 
    }; 
  }, []);
  
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setShowPreview(true);
    setProgress(0);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload/`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      console.log("Uploaded:", data);

      // Simulated progress
      let p = 0;
      const interval = setInterval(() => {
        p += 20;
        setProgress(p);
        if (p >= 100) clearInterval(interval);
      }, 100);

    } catch (error) {
      console.error("Upload failed", error);
    }
  };

  return (
    <div className="app">
      {!isOnline && (
        <div className="offline-indicator"> 
          📴 Offline Mode — Changes saved locally 
        </div>
      )}

      <div className="container">
        <header>
          <h1>Smart Resource Allocation System</h1>
          <p>Data Collection Module — Step 1</p>
        </header>

        <h1>File Upload</h1>

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
