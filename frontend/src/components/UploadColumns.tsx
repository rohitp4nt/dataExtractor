import { useState } from "react";
import axios from "axios";
import { Plus, X, Save, AlertCircle, CheckCircle } from "lucide-react";

const UploadColumns = () => {
  const [columns, setColumns] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleAddColumn = () => {
    setColumns([...columns, ""]);
  };

  const handleColumnChange = (index: number, value: string) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
  };

  const handleRemoveColumn = (index: number) => {
    if (columns.length > 1) {
      const newColumns = [...columns];
      newColumns.splice(index, 1);
      setColumns(newColumns);
    }
  };

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: null, message: "" });
    }, 5000);
  };

  const handleSubmit = async () => {
    const filteredColumns = columns.filter(col => col.trim() !== "");
    
    if (filteredColumns.length === 0) {
      showNotification("error", "Please add at least one column name");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post("https://dataextractor-h9sl.onrender.com/upload-columns", {
        columns: filteredColumns,
      });
      showNotification("success", response.data.message || "Columns submitted successfully");
    } catch (err) {
      showNotification("error", "Error uploading columns. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg h-full flex flex-col">
      {/* Card Header */}
      <div className="">
        <p className="text-blue-100 text-sm mt-1">
          Add column names for your data table
        </p>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-grow overflow-y-auto">
        {/* Notification */}
        {notification.type && (
          <div className={`mb-4 p-3 rounded-lg flex items-center text-sm ${notification.type === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"}`}>
            {notification.type === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            )}
            {notification.message}
          </div>
        )}

        {/* Column Inputs */}
        <div className="space-y-3 mb-5">
          {columns.map((col, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="relative flex-grow">
                <input
                  type="text"
                  value={col}
                  placeholder={`Column ${idx + 1} name`}
                  onChange={(e) => handleColumnChange(idx, e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute left-3 top-3 text-gray-400 dark:text-gray-500 text-xs">
                  {idx + 1}
                </span>
              </div>
              <button
                onClick={() => handleRemoveColumn(idx)}
                disabled={columns.length <= 1}
                className={`p-2 rounded-lg ${columns.length <= 1 ? "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed" : "bg-red-100 text-red-500 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40"}`}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer with Actions */}
      <div className="p-5 border-t border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleAddColumn}
            className="flex-1 px-4 py-2.5 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Column</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`flex-1 px-4 py-2.5 flex items-center justify-center gap-2 ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"} text-white rounded-lg transition-colors duration-200`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Submit Columns</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadColumns;
