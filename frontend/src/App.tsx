import UploadCard from "./components/uploadCard";
import CsvDownloadCard from "./components/download";
import UploadColumns from "./components/UploadColumns";
import Navbar from "./components/navbar";
import { ArrowRight } from 'lucide-react'; // Assuming you're using lucide-react for icons

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      {/* Main content container */}
      <div className="container mx-auto px-4 pt-24 pb-16 min-h-screen">
        {/* Title Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-teal-500 to-cyan-500 bg-clip-text text-transparent">
            PDF Data Extraction
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Extract tabular data from your PDFs in three simple steps
          </p>
        </div>

        {/* Step indicators */}
        <div className="hidden md:flex justify-center mb-12">
          <div className="flex items-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                1
              </div>
              <span className="mt-2 font-medium text-teal-600 dark:text-teal-400">Define Columns</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                2
              </div>
              <span className="mt-2 font-medium text-cyan-600 dark:text-cyan-400">Upload PDF</span>
            </div>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 mx-2"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                3
              </div>
              <span className="mt-2 font-medium text-blue-600 dark:text-blue-400">Download Data</span>
            </div>
          </div>
        </div>

        {/* Grid for the 3-step process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative h-full p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-600 dark:text-teal-400 font-bold mr-3">
                  1
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Define Columns</h3>
              </div>
              <UploadColumns />
              <div className="hidden lg:flex justify-end mt-4">
                <ArrowRight className="w-6 h-6 text-teal-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative h-full p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400 font-bold mr-3">
                  2
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Upload PDF</h3>
              </div>
              <UploadCard />
              <div className="hidden lg:flex justify-end mt-4">
                <ArrowRight className="w-6 h-6 text-cyan-500 animate-pulse" />
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl blur opacity-50 group-hover:opacity-75 transition duration-300"></div>
            <div className="relative h-full p-6 bg-white dark:bg-slate-800 rounded-lg shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold mr-3">
                  3
                </div>
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Download Data</h3>
              </div>
              <CsvDownloadCard />
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-16 text-center">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Securely process your PDFs with our advanced extraction algorithm
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
