import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const isActive = (path) => {
    const base = "inline-flex items-center h-full border-b-2 px-1 text-sm font-medium transition-colors ";
    return location.pathname === path 
      ? base + "border-zinc-900 text-zinc-900" 
      : base + "border-transparent text-zinc-500 hover:text-zinc-800 hover:border-zinc-300";
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/80">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
              <svg className="w-6 h-6 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume Matcher
            </Link>
          </div>
          <div className="flex items-center space-x-8 h-full hidden sm:flex">
            <Link to="/upload" className={isActive('/upload')}>
              Upload Resume
            </Link>
            <Link to="/jobs/all" className={isActive('/jobs/all')}>
              View Jobs
            </Link>
            <Link to="/jobs" className={isActive('/jobs')}>
              Add Job
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
