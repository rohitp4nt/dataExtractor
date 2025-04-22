import React, { useState } from "react";
import { Upload, CheckCircle, AlertCircle, File } from "lucide-react";

const UploadCard = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    processFiles(selectedFiles);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const processFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setError("No files selected.");
      return;
    }

    const validFiles: File[] = [];
    let hasInvalidFile = false;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      if (file.type === "application/pdf") {
        validFiles.push(file);
      } else {
        hasInvalidFile = true;
      }
    }

    if (validFiles.length > 0) {
      setFiles(validFiles);
      setError("");
      setSuccess(false);
    }

    if (hasInvalidFile) {
      setError("Some files are not valid PDF files.");
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError("No files selected.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append("files", file));

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("https://dataextractor-h9sl.onrender.com/upload-pdf/", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccess(true);
        setFiles([]);
      } else {
        const data = await response.json();
        throw new Error(data.detail || "Upload failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Status Messages */}
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg flex items-center">
          <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Upload and extraction successful!</span>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg flex items-center">
          <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Upload Area */}
      <div 
        className={`flex-grow border-2 border-dashed rounded-lg p-6 mb-4 flex flex-col items-center justify-center cursor-pointer transition-colors
          ${dragActive ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          multiple
          className="hidden"
        />
        
        <div className="w-16 h-16 mb-4 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
          <Upload className="h-8 w-8" />
        </div>
        
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Drop your PDFs here
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 text-center">
          or click to browse files
        </p>
        
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Supports: PDF files
        </p>
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mb-4 max-h-40 overflow-y-auto">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Selected Files ({files.length}):
          </p>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <File className="h-4 w-4 mr-2 text-cyan-500" />
                <span className="truncate">{file.name}</span>
                <span className="ml-auto text-xs">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading || files.length === 0}
        className={`w-full py-3 rounded-lg font-medium flex items-center justify-center transition-colors
          ${loading || files.length === 0 
            ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed' 
            : 'bg-cyan-500 hover:bg-cyan-600 text-white'}`}
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </>
        ) : (
          <>
            <Upload className="h-5 w-5 mr-2" />
            {files.length === 0 ? "Select PDF Files" : `Upload ${files.length} PDF${files.length > 1 ? 's' : ''}`}
          </>
        )}
      </button>

      {/* Loading Message */}
      {loading && (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Extracting data from PDFs, please wait...
          </p>
        </div>
      )}
    </div>
  );
};

export default UploadCard;