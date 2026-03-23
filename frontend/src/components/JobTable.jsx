import { useState, Fragment } from 'react';
import { getSuggestions } from '../services/api';

const JobTable = ({ jobs, resumeId }) => {
  const [suggestions, setSuggestions] = useState({}); // { jobId: text }
  const [loadingSuggestions, setLoadingSuggestions] = useState({}); // { jobId: bool }

  const handleGetSuggestions = async (jobId) => {
    if (suggestions[jobId]) {
      setSuggestions((prev) => {
        const next = { ...prev };
        delete next[jobId];
        return next;
      });
      return;
    }

    setLoadingSuggestions((prev) => ({ ...prev, [jobId]: true }));
    try {
      const response = await getSuggestions(resumeId, jobId);
      if (response.success) {
        setSuggestions((prev) => ({ ...prev, [jobId]: response.data }));
      }
    } catch (err) {
      alert('Failed to get AI suggestions. Please try again.');
    } finally {
      setLoadingSuggestions((prev) => ({ ...prev, [jobId]: false }));
    }
  };

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-16 bg-white border border-dashed border-zinc-200 rounded-2xl text-zinc-500">
        No matching jobs found in the database.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto shadow-[0_4px_20px_rgb(0,0,0,0.02)] border border-zinc-200 rounded-2xl bg-white">
      <table className="min-w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            <th className="px-6 py-4 font-semibold text-zinc-500 w-16 text-center uppercase tracking-wider text-xs">Rank</th>
            <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Job Title</th>
            <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Location</th>
            <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-xs">Match Score</th>
            <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-xs text-right text-transparent">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {jobs.map((job, index) => {
            const scorePercent = Math.round(job.similarityScore * 100);
            
            let scoreBadge = '';
            if (scorePercent >= 80) scoreBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200';
            else if (scorePercent >= 50) scoreBadge = 'bg-amber-50 text-amber-700 border-amber-200';
            else scoreBadge = 'bg-red-50 text-red-700 border-red-200';

            return (
              <Fragment key={job.jobId}>
                <tr className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-5 text-center font-semibold text-zinc-400">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 mx-auto text-xs">{index + 1}</span>
                  </td>
                  <td className="px-6 py-5 font-semibold text-zinc-900">
                    {job.jobTitle}
                  </td>
                  <td className="px-6 py-5 text-zinc-500 font-medium">
                    {job.location || 'Remote'}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${scoreBadge}`}>
                      {scorePercent}% Match
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => handleGetSuggestions(job.jobId)}
                      disabled={loadingSuggestions[job.jobId]}
                      className="inline-flex items-center justify-center text-sm font-medium transition-colors text-zinc-600 hover:text-zinc-900 border border-zinc-200 bg-white hover:bg-zinc-50 rounded-lg px-4 py-2 shadow-sm disabled:opacity-50 disabled:bg-zinc-50"
                    >
                      {loadingSuggestions[job.jobId] 
                        ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Thinking...
                          </>
                        )
                        : suggestions[job.jobId] ? 'Hide Advice' : 'Improve Resume'}
                    </button>
                  </td>
                </tr>
                {suggestions[job.jobId] && (
                  <tr className="bg-zinc-50/50 animate-in fade-in slide-in-from-top-2">
                    <td colSpan="5" className="px-6 py-8 border-t border-dashed border-zinc-200">
                      <div className="max-w-4xl mx-auto bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-zinc-100">
                          <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span className="text-sm font-bold text-zinc-900">AI Improvement Suggestions</span>
                        </div>
                        <div className="prose prose-sm prose-zinc max-w-none text-zinc-700 leading-relaxed whitespace-pre-wrap">
                          {suggestions[job.jobId]}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default JobTable;
