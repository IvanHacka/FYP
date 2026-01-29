import axios from 'axios';

const API_URL = 'http://localhost:8080/api';
const api = axios.create({
    baseURL: API_URL
});

// attach token to header
api.interceptors.request.use((config) => {
    // browser cache
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// api
export const register = (userData) => {
    return api.post('/users/register', userData);
}
export const login = (email, password) => {
    return api.post('/auth/login', {email, password});
};
export const fetchJobs = (filters = {}) => {
    // get user filter input (e.g title)
    const params = new URLSearchParams(filters).toString();
    return api.get(`/jobs/search?${params}`);
};
export const applyJob = (jobId, employeeId) => {
    return api.post(`/applications/apply?jobId=${jobId}&employeeId=${employeeId}`);
};
export const createJob = (jobData) => {
    return api.post('/jobs', jobData);
};
export const uploadCv = (userId, file) => {
    const formData = new FormData();
    // @RequestParam
    formData.append('file', file);

    return api.post(`/employees/${userId}/cv`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
};
export default api;
