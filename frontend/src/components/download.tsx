import { useState } from "react";

const CsvDownloadCard = () => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/download-csv/");

      if (!response.ok) {
        throw new Error("Failed to download CSV");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "extracted_data.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 rounded-xl shadow-md text-center ">
     

      {/* ⚠️ Warning */}
      <p className="text-yellow-600 font-medium mb-4">
        ⚠️ Please do not click download before extraction is complete.
      </p>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200 disabled:bg-gray-400"
      >
        {downloading ? "Downloading..." : "Download CSV"}
      </button>

      {success && (
        <p className="text-green-500 mt-4 text-lg">Download successful!</p>
      )}
      {error && <p className="text-red-500 mt-4 text-lg">{error}</p>}
    </div>
  );
};

export default CsvDownloadCard;
