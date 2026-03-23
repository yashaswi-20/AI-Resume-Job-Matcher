import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';

const UploadResume = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedResumeId, setUploadedResumeId] = useState('');
  
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
      setUploadedResumeId('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    
    try {
      const response = await uploadResume(file);
      if (response.success && response.data?.resumeId) {
        setUploadedResumeId(response.data.resumeId);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-12 mb-20">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Upload Resume</h1>
          <p className="text-zinc-500 text-sm">Upload your resume to get matched with the best jobs.</p>
        </div>
        
        <form onSubmit={handleUpload}>
          <div className="mb-8">
            <label className="block text-sm font-medium text-zinc-700 mb-3">
              Select Resume <span className="text-zinc-400 font-normal">(PDF or DOCX)</span>
            </label>
            <div className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-200 ${file ? 'border-zinc-500 bg-zinc-50/50' : 'border-zinc-300 hover:border-zinc-400 hover:bg-zinc-50'}`}>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {!file ? (
                <>
                  <svg className="w-6 h-6 text-zinc-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  <p className="text-sm font-medium text-zinc-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-zinc-500 mt-1">PDF or DOCX (MAX. 5MB)</p>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 text-emerald-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-zinc-900">{file.name}</p>
                  <p className="text-xs text-zinc-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </>
              )}
            </div>
          </div>

          {error && (
            <div className="mb-6 text-sm text-red-600 bg-red-50/50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
              <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {!uploadedResumeId ? (
            <button
              type="submit"
              disabled={!file || loading}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex justify-center items-center gap-2
                ${!file || loading 
                  ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
                  : 'bg-zinc-900 text-white shadow-sm hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]'}`}
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {loading ? 'Processing...' : 'Upload Resume'}
            </button>
          ) : (
            <div className="space-y-6">
              <div className="p-5 bg-emerald-50/50 rounded-xl border border-emerald-100 flex items-start gap-3">
                <svg className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-900">Upload Successful</h3>
                  <p className="text-xs text-emerald-700/80 mt-1 font-mono break-all">{uploadedResumeId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/matches/${uploadedResumeId}`)}
                className="w-full py-3 px-4 bg-zinc-900 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98] flex justify-center items-center gap-2"
              >
                Find Matching Jobs
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UploadResume;
