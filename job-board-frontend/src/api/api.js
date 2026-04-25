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
},
    //
    (error) => Promise.reject(error)
);

// api
// AUTH
export const register = (userData) =>{
    return api.post('/auth/register', userData);
}
export const login = (email, password) =>{
    return api.post('/auth/login', {email, password});
};

// Profile

export const getProfileCompletion = () =>{
    return api.get('/profile/completion');
}

export const getProfile = () =>{
    return api.get('/profile/me');
};

export const updateProfile = (profileData) => {
    return api.put('/profile/update', profileData);
};

export const getExperiences = () => {
    return api.get('/profile/experiences');
};

export const addExperience = (experienceData) => {
    return api.post('/profile/experiences', experienceData);
};

export const updateExperience = (id, experienceData) => {
    return api.put(`/profile/experiences/${id}`, experienceData);
};

export const deleteExperience = (id) =>{
    return api.delete(`/profile/experience/${id}`);
};

export const getEducation = () => {
    return api.get('/education');
};

export const addEducation = (data) =>{
    return api.post('/education', data);
};

export const updateEducation = (educationId, data) =>{
    return api.put(`/education/${educationId}`, data);
};

export const deleteEducation = (educationId) =>{
    return api.delete(`/education/${educationId}`);
};

export const searchInstitutions = (institution) => {
    return api.get(`/institutions/search?institution=${encodeURIComponent(institution)}`);
}

export const getEmployeePreferences = () => {
    return api.get('/profile/preferences');
}

export const updateEmployeePreferences = (data) => {
    return api.put('/profile/preferences', data);
}

// Documents

export const getDocuments = () =>{
    return api.get('/profile/documents');
}

export const uploadDocument = (file, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);

    return api.post('/profile/documents',
        formData,
        {headers: {'Content-Type': "multipart/form-data"},
        });
};

export const downloadDocument = (documentId) =>{
    return api.get(`/profile/documents/download/${documentId}`,
        {responseType: 'blob'}); // important
};

export const deleteDocument = (documentId) => {
    return api.delete(`/profile/documents/${documentId}`);
};


// Skills

export const getSkills = () => {
    return api.get('/employees/skills');
}

export const addSkill = (skillData) => {
    return api.post('/employees/skills', skillData);
}

export const updateSkillProficiency = (skillId, proficiencyLevel) => {
    return api.put(`/employees/skills/${skillId}`, {proficiencyLevel}); // {} as json expected
}

export const deleteSkill = (skillId) => {
    return api.delete(`/employees/skills/${skillId}`);
}

export const getSkillCount = () => {
    return api.get('/employees/skills/count');
}

export const getSkillList = () => {
    return api.get('/skills');
}

// Job

export const fetchJobs = () => {
    return api.get(`/jobs`);
};
export const fetchApplications = (jobId) => {
    return api.get(`/applications/${jobId}`);
};
export const applyJob = (jobId, whyGoodFit, expectedSalary, availableStartDate) => {
    return api.post('/applications/apply', {jobId, whyGoodFit, expectedSalary, availableStartDate});
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

export const deleteJob = (jobId) => {
    return api.delete(`/jobs/${jobId}`);
};

// job status
export const updateJobStatus = (jobId, newStatus) => {
    return api.put(`/jobs/${jobId}/status?status=${newStatus}`)
}

export const updateJobExpiry = (jobId, expiresAt) => {
    return api.put(`/jobs/${jobId}/expiry`, { expiresAt });
};

export const getWatchList = () => {
    return api.get('/watchList');
};

export const saveJob = (jobId) => {
    return api.post(`/watchList/${jobId}`);
};

export const removeSavedJob = (jobId) => {
    return api.delete(`/watchList/${jobId}`);
};

// Job skill
export const addJobSkill = (jobId, skillData) => {
    return api.post(`/jobSkills/${jobId}`, skillData);
};

export const getJobSkills = (jobId) => {
    return api.get(`/jobSkills/${jobId}`);
};

export const updateJobSkill = (jobSkillId, importanceLevel) => {
    return api.put(`/jobSkills/${jobSkillId}`, {importanceLevel});
};

export const deleteJobSkill = (jobSkillId) => {
    return api.delete(`/jobSkills/${jobSkillId}`);
};

// Application
export const getEmployerApplications = ()=> {
    return api.get('/applications/employer')
}
export const getEmployeeApplications = () => {
    return api.get('/applications/employee')
}

export const updateApplicationStatus = (applicationId, status, employerNotes = '') => {
    return api.put(`/applications/${applicationId}/status`, {status,employerNotes});
};

export const withdrawApplication = (applicationId) => {
    return api.put(`/applications/${applicationId}/withdraw`);
};

export const getMatchScoreBreakdown = (jobId) => {
    return api.get(`/applications/matchScore/${jobId}`);
};

export const downloadApplicationDocumentsForEmployer = (applicationId, documentId) => {
    return api.get(`/applications/${applicationId}/documents/${documentId}/download`, {
        responseType: 'blob'
    });
}

export const getApplicationTimeline = (applicationId) => {
    return api.get(`/applications/${applicationId}/timeline`);
};

// admin
export const fetchPendingEmployers = () => {
    return api.get('/admin/pending');
};
export const approveEmployers = (userId) => {
    return api.put(`/admin/approveEmployers/${userId}`);
};


export const getAllUsers = () => {
    return api.get('/admin/users');
};


export const getInactiveUsers = () => {
    return api.get('/admin/inactive-users');
};

// Ban user
export const banUser = (userId) => {
    return api.put(`/admin/users/${userId}/ban`);
};

// Reactive a banned user
export const reactivateUser = (userId) => {
    return api.put(`/admin/users/${userId}/reactivate`);
};

export default api;
