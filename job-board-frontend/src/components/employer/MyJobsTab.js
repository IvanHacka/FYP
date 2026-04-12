import React, { useEffect, useState } from 'react';
import { getMyJobs, fetchApplications, getCvDownloadUrl, deleteJob,
    updateJobStatus, getJobSkills, addJobSkill, updateJobSkill, deleteJobSkill, getSkillList } from '../../api/api';

function MyJobsTab() {
    const [myJobs, setMyJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [loading, setLoading] = useState(true);

    // Importance
    const [newImportanceByJob, setNewImportanceByJob] = useState({});
    const [editImportanceBySkill, setEditImportanceBySkill] = useState({});

    // Handle skills
    const [newSkillByJob, setNewSkillByJob] = useState({});
    const [allSkills, setAllSkills] = useState([]);
    const [jobSkillsMap, setJobSkillsMap] = useState({});
    const [showSkills, setShowSkills] = useState(null);

    useEffect(() => {
        loadMyJobs();
        loadSkillList();
    }, []);

    const loadMyJobs = async () => {
        try {
            const jobsRes = await getMyJobs();
            setMyJobs(jobsRes.data || []);
        } catch (error) {
            console.error('Failed to load my jobs:', error);
            alert('Failed to load your jobs.');
        } finally {
            setLoading(false);
        }
    };

    const handleViewApplicants = async (jobId) => {
        if (selectedJobId === jobId) {
            setSelectedJobId(null);
            setApplications([]);
            return;
        }

        try {
            const response = await fetchApplications(jobId);
            setApplications(response.data || []);
            setSelectedJobId(jobId);
        } catch (error) {
            console.error('Failed to load applicants:', error);
            alert('Could not load applicants');
        }
    };

    const handleDeleteJob = async (jobId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this job?");
        if (!confirmDelete)
            return;
        try {
            await deleteJob(jobId);
            setMyJobs(prev => prev.filter(job => job.id !== jobId));
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete job");
        }
    };

    const loadSkillList = async () => {
        try {
            const res = await getSkillList();
            setAllSkills(res.data || []);
        } catch (error) {
            console.error('Failed to load skill list:', error);
            alert('Failed to load skill list');
        }
    };

    const handleAddJobSkill = async (jobId) => {
        const skillId = newSkillByJob[jobId];
        const importanceLevel = Number(newImportanceByJob[jobId] || 1);

        if (!skillId) {
            alert('Please select a skill');
            return;
        }

        try {
            const res = await addJobSkill(jobId, {
                skillId: Number(skillId),
                importanceLevel
            });

            setJobSkillsMap(prev => ({
                ...prev,
                [jobId]: [...(prev[jobId] || []), res.data]
            }));

            setNewSkillByJob(prev => ({
                ...prev,
                [jobId]: ''
            }));

            setNewImportanceByJob(prev => ({
                ...prev,
                [jobId]: 1
            }));
        } catch (error) {
            console.error('Failed to add skill:', error);
            alert(error?.response?.data?.message || 'Failed to add skill');
        }
    };

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            const res = await updateJobStatus(jobId, newStatus);

            setMyJobs(prev =>
                prev.map(job =>
                    job.id === jobId ? { ...job, status: res.data.status } : job
                )
            );
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    const handleUpdateJobSkill = async (jobId, jobSkillId) => {
        const importanceLevel = Number(editImportanceBySkill[jobSkillId]);

        if (!importanceLevel || importanceLevel < 1 || importanceLevel > 5) {
            alert('Importance level must be between 1 and 5');
            return;
        }

        try {
            const res = await updateJobSkill(jobSkillId, importanceLevel);

            setJobSkillsMap(prev => ({
                ...prev,
                [jobId]: prev[jobId].map(skill =>
                    skill.id === jobSkillId ? res.data : skill
                )
            }));
        } catch (error) {
            console.error('Failed to update skill importance:', error);
            alert('Failed to update skill importance');
        }
    };


    const handleToggleSkills = async (jobId) => {
        if (showSkills === jobId) {
            setShowSkills(null);
            return;
        }

        try {
            if (!jobSkillsMap[jobId]) {
                const res = await getJobSkills(jobId);
                const skills = res.data || [];

                setJobSkillsMap(prev => ({
                    ...prev,
                    [jobId]: skills
                }));

                const initialEditValues = {};
                skills.forEach(skill => {
                    initialEditValues[skill.id] = skill.importanceLevel;
                });

                setEditImportanceBySkill(prev => ({
                    ...prev,
                    ...initialEditValues
                }));
            }

            setShowSkills(jobId);
        } catch (error) {
            console.error('Failed to load job skills:', error);
            alert('Failed to load job skills');
        }
    };

    if (loading) {
        return <div className="loading">Loading your jobs...</div>;
    }

    return (
        <div className="tab-panel">
            <div className="section-header">
                <h2>Your Job Posts</h2>
                <button className="btn btn-outline" onClick={loadMyJobs}>
                    Refresh
                </button>
            </div>

            <div className="job-count">
                <strong>{myJobs.length}</strong> job{myJobs.length !== 1 ? 's' : ''}
            </div>

            {myJobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No jobs posted yet</h3>
                    <p>Create your first job posting in the Post Job tab!</p>
                </div>
            ) : (
                <ul className="job-list">
                    {myJobs.map(job => (
                        <li key={job.id} className="job-card">
                            <div className="job-card-content">
                                <div className="job-header">
                                    <h3>{job.title}</h3>
                                    <span className={`status-badge status-${job.status?.toLowerCase()}`}>
                                        {job.status || 'OPEN'}
                                    </span>
                                </div>

                                <div className="job-meta">
                                    <span>📍 {job.location || 'Remote'}</span>
                                    <span>💸 ${job.minSalary?.toLocaleString() || 'Negotiable'}</span>
                                    <span>🕒 {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>

                                <p className="job-description">
                                    {job.description
                                        ? (job.description.length > 200
                                            ? `${job.description.substring(0, 200)}...`
                                            : job.description)
                                        : 'No description provided'}
                                </p>

                                <div className="job-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleViewApplicants(job.id)}
                                    >
                                        {selectedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                                    </button>

                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleToggleSkills(job.id)}
                                    >
                                        {showSkills === job.id ? 'Hide Skills' : 'Edit Skills'}
                                    </button>

                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleStatusChange(job.id, 'OPEN')}
                                        disabled={job.status === 'OPEN'}
                                    >
                                        Open
                                    </button>

                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => handleStatusChange(job.id, 'CLOSED')}
                                        disabled={job.status === 'CLOSED'}
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteJob(job.id)}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {showSkills === job.id && (
                                    <div className="detail-box">
                                        <h4>Required Skills</h4>

                                        <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            <select
                                                value={newSkillByJob[job.id] || ''}
                                                onChange={(e) =>
                                                    setNewSkillByJob(prev => ({
                                                        ...prev,
                                                        [job.id]: e.target.value
                                                    }))
                                                }
                                                className="form-control"
                                            >
                                                <option value="">Select skill</option>
                                                {allSkills.map(skill => (
                                                    <option key={skill.id} value={skill.id}>
                                                        {skill.skillName}
                                                    </option>
                                                ))}
                                            </select>

                                            <input
                                                type="number"
                                                min="1"
                                                max="5"
                                                value={newImportanceByJob[job.id] || 1}
                                                onChange={(e) =>
                                                    setNewImportanceByJob(prev => ({
                                                        ...prev,
                                                        [job.id]: e.target.value
                                                    }))
                                                }
                                                placeholder="Importance 1-5"
                                                className="form-control"
                                                style={{ width: '140px' }}
                                            />

                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleAddJobSkill(job.id)}
                                            >
                                                Add Skill
                                            </button>
                                        </div>

                                        {(jobSkillsMap[job.id] || []).length === 0 ? (
                                            <p style={{ color: '#7f8c8d' }}>No skills added yet.</p>
                                        ) : (
                                            <ul className="applicants-list">
                                                {(jobSkillsMap[job.id] || []).map(skill => (
                                                    <li key={skill.id} className="applicant-item">
                                                        <div className="applicant-info">
                                                            <strong>{skill.skillName}</strong>
                                                            <div style={{ marginTop: '8px', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                                                <input
                                                                    type="number"
                                                                    min="1"
                                                                    max="5"
                                                                    value={editImportanceBySkill[skill.id] ?? skill.importanceLevel}
                                                                    onChange={(e) =>
                                                                        setEditImportanceBySkill(prev => ({
                                                                            ...prev,
                                                                            [skill.id]: e.target.value
                                                                        }))
                                                                    }
                                                                    className="form-control"
                                                                    style={{ width: '140px' }}
                                                                />

                                                                <button
                                                                    className="btn btn-outline btn-sm"
                                                                    onClick={() => handleUpdateJobSkill(job.id, skill.id)}
                                                                >
                                                                    Update
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={async () => {
                                                                    const confirmed = window.confirm(`Remove ${skill.skillName}?`);
                                                                    if (!confirmed) return;

                                                                    try {
                                                                        await deleteJobSkill(skill.id);
                                                                        setJobSkillsMap(prev => ({
                                                                            ...prev,
                                                                            [job.id]: prev[job.id].filter(s => s.id !== skill.id)
                                                                        }));
                                                                    } catch (error) {
                                                                        console.error('Failed to delete skill:', error);
                                                                        alert('Failed to delete skill');
                                                                    }
                                                                }}
                                                            >
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}

                                {selectedJobId === job.id && (
                                    <div className="detail-box">
                                        <h4>👥 Applicants for "{job.title}"</h4>

                                        {applications.length === 0 ? (
                                            <p style={{color: '#7f8c8d', textAlign: 'center', padding: '20px'}}>
                                                No applicants yet.
                                            </p>
                                        ) : (
                                            <ul className="applicants-list">
                                                {applications.map(app => (
                                                    <li key={app.id} className="applicant-item">
                                                        <div className="applicant-info">
                                                        <strong>{app.applicantFullName || 'Unknown'}</strong>
                                                            <div style={{color: '#7f8c8d', fontSize: '0.9rem'}}>
                                                                {app.applicantEmail}
                                                            </div>
                                                            <div style={{color: '#2563eb', fontSize: '0.9rem', fontWeight: 600}}>
                                                                Match Score: {app.matchScore ?? 'N/A'}%
                                                            </div>
                                                            <div style={{color: '#666', fontSize: '0.85rem'}}>
                                                                Skills {app.skillScore ?? 'N/A'}%
                                                                Title {app.titleScore ?? 'N/A'}%
                                                                Location {app.locationScore ?? 'N/A'}%
                                                                Salary {app.salaryScore ?? 'N/A'}%
                                                                Type {app.jobTypeScore ?? 'N/A'}%
                                                            </div>
                                                        </div>

                                                        <div>
                                                            {app.applicantCv ? (
                                                                <a
                                                                    href={getCvDownloadUrl(app.applicant.cv)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="btn btn-sm btn-outline"
                                                                >
                                                                    📄 Download CV
                                                                </a>
                                                            ) : (
                                                                <span style={{color: '#e74c3c', fontSize: '0.85rem'}}>
                                                                    No CV uploaded
                                                                </span>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyJobsTab;