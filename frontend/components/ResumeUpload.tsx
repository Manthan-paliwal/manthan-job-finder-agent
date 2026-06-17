"use client";

import { useState } from "react";
import axios from "axios";

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function analyzeResume() {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post(
        "http://127.0.0.1:8000/analyze-resume",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("FULL RESPONSE:", response.data);

      setResult(response.data);
    } catch (error) {
      console.error(error);
      alert("Analysis Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center">
      <div className="w-full max-w-5xl p-10">
        <h1 className="text-6xl font-bold mb-10">
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

        <div className="mt-4 text-xl">
          {file ? file.name : "No file selected"}
        </div>

        <button
          onClick={analyzeResume}
          disabled={loading}
          className="mt-6 border px-6 py-3 rounded text-xl"
        >
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>

        {result && (
          <div className="mt-10 border rounded p-8">
            <h2 className="text-4xl font-bold mb-8">
              ATS Analysis Result
            </h2>

            {/* SCORE */}
            <div className="mb-8">
              <h3 className="text-3xl font-bold">
                ATS Score:{" "}
                {result.analysis?.score ||
                  result.score ||
                  "Not Found"}
                /100
              </h3>
            </div>

            {/* STRENGTHS */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-3">
                Strengths
              </h3>

              <ul className="list-disc pl-6">
                {(result.analysis?.strengths ||
                  result.strengths ||
                  []
                ).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* MISSING SKILLS */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-3">
                Missing Skills
              </h3>

              <ul className="list-disc pl-6">
                {(result.analysis?.missing_skills ||
                  result.missing_skills ||
                  []
                ).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* IMPROVEMENTS */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-3">
                Improvements
              </h3>

              <ul className="list-disc pl-6">
                {(result.analysis?.improvements ||
                  result.improvements ||
                  []
                ).map((item: string, index: number) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            {/* RAW RESPONSE DEBUG */}
            <div className="mt-10">
              <h3 className="text-xl font-bold mb-3">
                Debug Response
              </h3>

              <pre className="bg-gray-900 p-4 rounded overflow-auto text-sm">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}