"use client";

import { useState } from "react";
import axios from "axios";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function uploadResume() {
    if (!file) {
      alert("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-resume",
        formData
      );

      setResult(response.data.analysis);
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        AI Resume ATS Analyzer
      </h1>

      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          if (e.target.files?.[0]) {
            setFile(e.target.files[0]);
          }
        }}
      />

      <br />
      <br />

      <button
        onClick={uploadResume}
        className="bg-black text-white px-5 py-3 rounded"
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>

      {result && (
        <div className="mt-10 border rounded p-6">

          <h2 className="text-3xl font-bold mb-5">
            ATS Score: {result.score}%
          </h2>

          <div className="grid md:grid-cols-3 gap-5">

            <div>
              <h3 className="font-bold text-xl mb-2">
                Strengths
              </h3>

              <ul>
                {result.strengths?.map(
                  (item: string, index: number) => (
                    <li key={index}>✅ {item}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-2">
                Missing Skills
              </h3>

              <ul>
                {result.missing_skills?.map(
                  (item: string, index: number) => (
                    <li key={index}>⚠️ {item}</li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-2">
                Improvements
              </h3>

              <ul>
                {result.improvements?.map(
                  (item: string, index: number) => (
                    <li key={index}>• {item}</li>
                  )
                )}
              </ul>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}