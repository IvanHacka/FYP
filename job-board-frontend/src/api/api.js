import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const api = axios.create({
    baseURL: API_URL
});

// attach jwt token to header
api.interceptors.request.use((config) => {
    // browser cache
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// api
// AUTH
export const register = (userData) => {
    return api.post('/auth/register', userData);
}
export const login = (email, password) => {
    return api.post('/auth/login', {email, password});
};

// Job
export const fetchJobs = () => {
    return api.get(`/jobs`);
};
export const fetchApplications = (jobId) => {
    return api.get(`/applications/${jobId}`);
};
export const applyJob = (jobId, userId) => {
    // Send JSON object
    return api.post('/applications/apply', {jobId: jobId, userId: userId})
};
export const createJob = (jobData) => {
    return api.post('/jobs', jobData);
};
export const getMyJobs = () => {
    return api.get('/jobs/myJobs');
}
export const searchJobs = (filters = {}) => {
    // Only if have values
    const params = new URLSearchParams();
    if (filters.title && filters.title.trim()){
        params.append('title', filters.title.trim());
    }
    if (filters.location && filters.location.trim()){
        params.append('location', filters.location.trim());
    }
    if (filters.minSalary && filters.minSalary>0){
        params.append('minSalary', filters.minSalary);
    }
    return api.get(`/jobs/search?${params.toString()}`)
}

// Application
export const getMyApplication = ()=> {
    return api.get('/applications/employer')
}
export const uploadCv = (userId, file) => {
    const formData = new FormData();
    // match @RequestParam
    formData.append('file', file);

    return api.post(`/employees/${userId}/cv`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};

// no axios only use link
export const getCvDownloadUrl = (fileName) => {
    return `http://localhost:8080/api/employees/cv/${fileName}`;
};

// admin
export const fetchPendingEmployers = () => {
    return api.get('/admin/pending');
};
export const approveEmployers = (userId) => {
    return api.put(`/admin/approveEmployers/${userId}`);
};

export default api;
