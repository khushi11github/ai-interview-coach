import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

export default api;

export const analyzeResumeWithAI = async (file: File, role: string, jobDescription: string) => {
  const formData = new FormData();
  formData.append('resume', file);
  formData.append('role', role);
  formData.append('jobDescription', jobDescription);
  const response = await api.post('/ai/resume/analyze', formData);
  return response.data;
};

export const evaluateInterviewWithAI = async (results: {
  role: string;
  difficulty: string;
  qaList: { question: string; answer: string; code?: string }[];
}) => {
  const response = await api.post('/ai/interview/evaluate', results);
  return response.data;
};
