import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
});

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const createJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const getMatches = async (resumeId) => {
  const response = await api.get(`/match/${resumeId}`);
  return response.data;
};

export const getJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const getSuggestions = async (resumeId, jobId) => {
  const response = await api.post('/suggestions', { resumeId, jobId });
  return response.data;
};

export default api;
