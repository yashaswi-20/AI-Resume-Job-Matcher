import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UploadResume from './pages/UploadResume';
import CreateJob from './pages/CreateJob';
import MatchResults from './pages/MatchResults';
import JobList from './pages/JobList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-zinc-900 selection:bg-zinc-200 selection:text-zinc-900">
        <Navbar />
        <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <Routes>
            <Route path="/" element={<Navigate to="/upload" replace />} />
            <Route path="/upload" element={<UploadResume />} />
            <Route path="/jobs" element={<CreateJob />} />
            <Route path="/jobs/all" element={<JobList />} />
            <Route path="/matches/:resumeId" element={<MatchResults />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
