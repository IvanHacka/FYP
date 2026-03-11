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
export const register = (userData) => {
    return api.post('/auth/register', userData);
}
export const login = (email, password) => {
    return api.post('/auth/login', {email, password});
};

// Profile

export const getProfileCompletion = () =>{
    return api.get('/employees/profile/completion');
}

export const getProfile = () => {
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

export const deleteExperience = (id) => {
    return api.delete(`/profile/experience/${id}`);
};

// Documents

export const getDocuments = () => {
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

export const downloadDocument = (documentId) => {
    return api.get(`/profile/documents/download/${documentId}`,
        {responseType: 'blob'}); // important
};

export const deleteDocument = (documentId) => {
    return api.delete(`/profile/documents/${documentId}`);
};

export const hasCv = () => {
    return api.get('/profile/hasCv');
}

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
