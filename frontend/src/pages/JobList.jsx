import { useState, useEffect } from 'react';
import { getJobs } from '../services/api';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getJobs();
        if (response.success) {
          setJobs(response.data);
        }
      } catch (err) {
        setError('Failed to load jobs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 mt-10">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-6 bg-red-50 border border-red-200 rounded-lg text-center text-red-600">
        {error}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-16 mb-20 p-16 animate-in fade-in duration-500 bg-white border border-zinc-200 border-dashed rounded-3xl text-center text-zinc-500 flex flex-col items-center justify-center">
        <svg className="w-10 h-10 text-zinc-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-3">No Jobs Found</h2>
        <p className="text-zinc-500 max-w-sm">Your database is currently empty. Add new positions to the system to begin matching algorithms.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 mb-2">Job Listings</h1>
          <p className="text-zinc-500 text-sm">Explore {jobs.length} available positions currently in the database.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {jobs.map((job) => (
          <div key={job._id || job.jobId} className="group bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-zinc-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-zinc-300 hover:-translate-y-1 transition-all duration-300">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 mb-2 group-hover:text-zinc-700 transition-colors">{job.title || job.jobTitle}</h2>
                {job.location && (
                  <div className="flex items-center text-sm font-medium text-zinc-500 mt-1">
                    <svg className="w-4 h-4 mr-1.5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {job.location}
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-zinc-600 mb-6 leading-relaxed whitespace-pre-wrap line-clamp-3">
              {job.description}
            </p>

            {job.requiredSkills && job.requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-5 border-t border-zinc-100">
                {job.requiredSkills.map((skill, i) => (
                  <span key={i} className="px-3 py-1 bg-zinc-100 text-zinc-700 text-xs tracking-wide rounded border border-zinc-200 font-medium whitespace-nowrap">
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobList;
