import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMatches } from '../services/api';
import JobTable from '../components/JobTable';

const MatchResults = () => {
  const { resumeId } = useParams();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const response = await getMatches(resumeId);
        if (response.success) {
          setMatches(response.data);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setError('Resume not found. Please upload it again.');
        } else {
          setError(err.response?.data?.error || 'Failed to fetch match results.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (resumeId) {
      fetchMatches();
    }
  }, [resumeId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] mt-10 space-y-4 animate-in fade-in duration-500">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-zinc-200 border-t-zinc-900"></div>
        <p className="text-zinc-500 font-medium">Analyzing matches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-16 p-8 bg-red-50/50 border border-red-100 rounded-2xl text-center shadow-sm animate-in fade-in slide-in-from-bottom-4">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 mb-3">
          <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-zinc-900 mb-2">Analysis Failed</h2>
        <p className="text-red-600 mb-8">{error}</p>
        <Link 
          to="/upload" 
          className="inline-flex items-center justify-center px-6 py-3 bg-zinc-900 text-white rounded-xl font-medium shadow-sm transition-all duration-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]"
        >
          Return to Upload
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full mt-10 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Match Results</h1>
          <p className="text-zinc-500 text-sm flex items-center gap-2">
            Top jobs ranked by semantic similarity for resume 
            <code className="bg-zinc-100 text-zinc-800 px-2 py-0.5 rounded-md font-mono text-xs border border-zinc-200">
              {resumeId.substring(0,8)}...
            </code>
          </p>
        </div>
        <Link 
          to="/upload" 
          className="inline-flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors bg-white border border-zinc-200 shadow-sm rounded-lg px-4 py-2 hover:bg-zinc-50"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Upload New Resume
        </Link>
      </div>

      <JobTable jobs={matches} resumeId={resumeId} />
    </div>
  );
};

export default MatchResults;
