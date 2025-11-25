import React, { useState } from "react";

const FileUploadExtractor = () => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [extractedText, setExtractedText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);

  // Upload file to backend and extract text
  const uploadFile = async () => {
    if (!file) return;
    setLoading(true);
    setExtractedText("");
    setAnalysis("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      // backend may return { text: "..." } or plain text — handle both
      setExtractedText(
        data?.text ?? (typeof data === "string" ? data : "No text extracted.")
      );
    } catch (err) {
      console.error(err);
      setExtractedText("Error extracting text. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // Analyze the extracted text via backend
  const handleAnalyze = async (e) => {
    e?.preventDefault();
    if (!extractedText) return alert("No text available to analyze!");
    setLoading(true);
    setAnalysis("");

    try {
      const res = await fetch("http://localhost:5001/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: extractedText }),
      });

      // backend might return JSON { analysis: "..." } or plain text
      const contentType = res.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        setAnalysis(
          data?.analysis ??
            (typeof data === "string" ? data : JSON.stringify(data))
        );
      } else {
        const text = await res.text();
        setAnalysis(text);
      }
    } catch (err) {
      console.error(err);
      setAnalysis("Error analyzing text. Check backend.");
    } finally {
      setLoading(false);
    }
  };

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const dropped = e.dataTransfer?.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleFileSelect = (e) => {
    const selected = e.target?.files?.[0];
    if (selected) setFile(selected);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-neutral-900 to-black text-gray-100 py-12 px-4">
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-white/6 to-white/4 border border-white/8 rounded-2xl p-6 w-80 flex flex-col items-center gap-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full border-4 border-t-blue-400 border-gray-700 animate-spin" />
            <div className="text-sm text-gray-300">Processing… please wait</div>
            <div className="text-xs text-gray-400">
              This overlay appears for both upload and analyze calls.
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Social Media Content Analyzer
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Upload PDFs or images (OCR supported on server), extract text, and
              analyze.
            </p>
          </div>
        </header>

        <div className="bg-gradient-to-br from-white/3 via-white/2 to-white/2 border border-white/6 rounded-2xl p-6 shadow-lg backdrop-blur-md">
          {/* Upload area */}
          <div
            className={`relative rounded-xl transition-all ${
              dragActive
                ? "ring-2 ring-blue-400/40 bg-gradient-to-br from-blue-900/40 to-violet-900/30"
                : "bg-gradient-to-br from-white/3 to-white/2"
            } border border-white/6 p-6 flex flex-col md:flex-row items-center gap-6`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="flex-1 min-w-0">
              <label
                htmlFor="fileInput"
                className="block cursor-pointer"
                onClick={(ev) => {
                  ev.preventDefault();
                  document.getElementById("fileInput")?.click();
                }}
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-600 to-violet-600 text-white shadow-md">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-7 h-7"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M12 3v12m0 0l-4-4m4 4 4-4"
                      />
                    </svg>
                  </div>

                  <div className="min-w-0">
                    <div className="text-lg font-semibold text-white">
                      Drag & drop files here
                    </div>
                    <div className="text-sm text-gray-400">
                      PDF, PNG, JPG. Click to select file or drop it into this
                      area.
                    </div>
                  </div>
                </div>
              </label>

              <input
                type="file"
                id="fileInput"
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {file && (
                <div className="mt-4 text-sm text-gray-300">
                  Selected file:{" "}
                  <span className="font-medium text-gray-100">{file.name}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex-shrink-0 flex flex-col items-center gap-3">
              <button
                onClick={() => document.getElementById("fileInput")?.click()}
                className="px-4 py-2 bg-white/6 hover:bg-white/8 text-sm rounded-lg border border-white/6 text-white"
                aria-label="Select file"
              >
                Choose File
              </button>

              <button
                onClick={uploadFile}
                disabled={!file || loading}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                  file
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-white/6 cursor-not-allowed text-gray-400"
                }`}
              >
                Upload
              </button>
            </div>
          </div>

          {/* Layout: extracted text and analysis side-by-side on wide screens */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Extracted text card */}
            <div className="bg-gradient-to-br from-white/3 to-white/2 border border-white/6 rounded-xl p-5 min-h-[220px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">
                  Extracted Text
                </h3>
                <div className="text-xs text-gray-400">
                  From your uploaded document
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-200 whitespace-pre-wrap max-h-56 overflow-auto bg-black/20 p-3 rounded-md">
                {extractedText ? (
                  <pre className="whitespace-pre-wrap text-sm break-words">
                    {extractedText}
                  </pre>
                ) : (
                  <div className="text-gray-400 text-sm">
                    No extracted text yet. Upload a file to begin.
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleAnalyze}
                  disabled={!extractedText || loading}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    extractedText
                      ? "bg-indigo-600 hover:bg-indigo-700"
                      : "bg-white/6 cursor-not-allowed text-gray-400"
                  }`}
                >
                  Analyze
                </button>

                <button
                  onClick={() => {
                    setExtractedText("");
                    setAnalysis("");
                    setFile(null);
                  }}
                  className="px-4 py-2 rounded-lg text-sm bg-white/6 hover:bg-white/8 text-gray-200"
                >
                  Reset
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white/3 to-white/2 border border-white/6 rounded-xl p-5 min-h-[220px]">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white">Analysis</h3>
                <div className="text-xs text-gray-400">
                  Summary & suggestions
                </div>
              </div>

              <div className="mt-2 text-sm text-gray-200 whitespace-pre-wrap max-h-56 overflow-auto bg-black/20 p-3 rounded-md">
                {analysis ? (
                  <pre className="whitespace-pre-wrap text-sm break-words">
                    {analysis}
                  </pre>
                ) : (
                  <div className="text-gray-400 text-sm">
                    No analysis yet. Click Analyze to get AI output.
                  </div>
                )}
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigator.clipboard?.writeText(analysis)}
                  disabled={!analysis}
                  className={`px-4 py-2 rounded-lg text-sm bg-white/6 hover:bg-white/8 text-gray-200 ${
                    !analysis ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Copy
                </button>

                <a
                  href={`data:text/plain;charset=utf-8,${encodeURIComponent(
                    analysis || ""
                  )}`}
                  download="analysis.txt"
                  className={`px-4 py-2 rounded-lg text-sm bg-white/6 hover:bg-white/8 text-gray-200 ${
                    !analysis ? "opacity-60 pointer-events-none" : ""
                  }`}
                >
                  Download
                </a>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="mt-6 text-xs text-gray-500">
            Tip: For best OCR results, upload clear scanned images or PDFs.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUploadExtractor;
