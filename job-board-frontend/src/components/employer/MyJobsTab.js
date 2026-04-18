import React, { useEffect, useState } from 'react';
import {getMyJobs, fetchApplications, downloadDocument, deleteJob,
    updateJobStatus, getJobSkills, addJobSkill, updateJobSkill, deleteJobSkill,
    getSkillList, updateApplicationStatus, updateJobExpiry, downloadApplicationDocumentsForEmployer}
from '../../api/api';

function MyJobsTab() {
    const [myJobs, setMyJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingApplicants, setLoadingApplicants] = useState(false);
    const [loadingSkillsByJob, setLoadingSkillsByJob] = useState({});

    const [newImportanceByJob, setNewImportanceByJob] = useState({});
    const [editImportanceBySkill, setEditImportanceBySkill] = useState({});

    const [newSkillByJob, setNewSkillByJob] = useState({});
    const [allSkills, setAllSkills] = useState([]);
    const [jobSkillsMap, setJobSkillsMap] = useState({});
    const [showSkills, setShowSkills] = useState(null);

    const [editExpiryByJob, setEditExpiryByJob] = useState({});
    const [employerNotesByApplication, setEmployerNotesByApplication] = useState({});
    const [showApplicantDetails, setShowApplicantDetails] = useState({});

    useEffect(() => {
        loadMyJobs();
        loadSkillList();
    }, []);

    const loadMyJobs = async () => {
        try {
            const jobsRes = await getMyJobs();
            console.log('My jobs response:', jobsRes.data);
            setMyJobs(jobsRes.data || []);
        } catch (error) {
            console.error('Failed to load my jobs:', error);
            alert('Failed to load your jobs.');
        } finally {
            setLoading(false);
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

    const handleViewApplicants = async (jobId) => {
        if (selectedJobId === jobId) {
            setSelectedJobId(null);
            setApplications([]);
            return;
        }

        try {
            setLoadingApplicants(true);
            const response = await fetchApplications(jobId);
            setApplications(response.data || []);
            setSelectedJobId(jobId);
        } catch (error) {
            console.error('Failed to load applicants:', error);
            alert(error?.response?.data?.message || 'Could not load applicants');
        } finally {
            setLoadingApplicants(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this job?');
        if (!confirmDelete) return;

        try {
            await deleteJob(jobId);
            setMyJobs(prev => prev.filter(job => job.id !== jobId));

            if (selectedJobId === jobId) {
                setSelectedJobId(null);
                setApplications([]);
            }

            if (showSkills === jobId) {
                setShowSkills(null);
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert(error?.response?.data?.message || 'Failed to delete job');
        }
    };

    const handleAddJobSkill = async (jobId) => {
        const skillId = newSkillByJob[jobId];
        const importanceLevel = Number(newImportanceByJob[jobId] || 1);

        if (!skillId) {
            alert('Please select a skill');
            return;
        }

        if (importanceLevel < 1 || importanceLevel > 5) {
            alert('Importance level must be between 1 and 5');
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

            setEditImportanceBySkill(prev => ({
                ...prev,
                [res.data.id]: res.data.importanceLevel
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
                [jobId]: (prev[jobId] || []).map(skill =>
                    skill.id === jobSkillId ? res.data : skill
                )
            }));
        } catch (error) {
            console.error('Failed to update skill importance:', error);
        }
    };

    const handleDeleteJobSkill = async (jobId, skill) => {
        const confirmed = window.confirm(`Remove ${skill.skillName}?`);
        if (!confirmed) return;

        try {
            await deleteJobSkill(skill.id);

            setJobSkillsMap(prev => ({
                ...prev,
                [jobId]: (prev[jobId] || []).filter(s => s.id !== skill.id)
            }));

            setEditImportanceBySkill(prev => {
                const updated = { ...prev };
                delete updated[skill.id];
                return updated;
            });
        } catch (error) {
            console.error('Failed to delete skill:', error);
        }
    };

    const handleToggleSkills = async (jobId) => {
        if (showSkills === jobId) {
            setShowSkills(null);
            return;
        }

        try {
            if (!jobSkillsMap[jobId]) {
                setLoadingSkillsByJob(prev => ({ ...prev, [jobId]: true }));

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
        } finally {
            setLoadingSkillsByJob(prev => ({ ...prev, [jobId]: false }));
        }
    };

    const handleJobStatusChange = async (jobId, newStatus) => {
        try {
            const res = await updateJobStatus(jobId, newStatus);

            setMyJobs(prev =>
                prev.map(job =>
                    job.id === jobId ? { ...job, status: res.data.status } : job
                )
            );
        } catch (error) {
            console.error('Failed to update job status', error);
        }
    };

    const handleApplicationStatusChange = async (applicationId, status) => {
        if (!applicationId) {
            console.log('Application id is missing');
            return;
        }
        const employerNotes = employerNotesByApplication[applicationId] || '';
        try {
            const res = await updateApplicationStatus(applicationId, status, employerNotes);
            setApplications(prev =>
                prev.map(app =>
                    app.applicationId === applicationId ?
                        {
                            ...app,
                            status: res.data.status,
                            employerNotes: res.data.employerNotes,
                            reviewedAt:res.data.reviewedAt
                        }
                        : app
                )
            );
        } catch (error) {
            console.error('Failed to update application status:', error);
        }
    };
    const handleSaveEmployerNotes = async (applicationId, currentStatus) => {
        if (!applicationId) {
            alert('Application id is missing');
            return;
        }

        const employerNotes = employerNotesByApplication[applicationId] || '';

        try {
            const res = await updateApplicationStatus(applicationId, currentStatus, employerNotes);

            setApplications(prev =>
                prev.map(app =>
                    app.applicationId === applicationId
                        ? {
                            ...app,
                            status: res.data.status,
                            employerNotes: res.data.employerNotes,
                            reviewedAt: res.data.reviewedAt
                        }
                        : app
                )
            );

            alert('Notes saved');
        } catch (error) {
            console.error('Failed to save employer notes:', error);
            alert(error?.response?.data?.message || 'Failed to save notes');
        }
    };

    const getDisplayJobStatus = (job) => {
        if (job.expiresAt && new Date(job.expiresAt) < new Date()) {
            return 'EXPIRED';
        }
        return job.status || 'OPEN';
    };

    const handleUpdateExpiry = async (jobId) => {
        const expiry = editExpiryByJob[jobId];

        if (!expiry) {
            alert('Please select an expiry date');
            return;
        }

        const expiresAt = `${expiry}T23:59:00`;

        try {
            const res = await updateJobExpiry(jobId, expiresAt);

            setMyJobs(prev =>
                prev.map(job =>
                    job.id === jobId ?
                        { ...job, expiresAt: res.data.expiresAt, status: res.data.status } :
                        job
                )
            );

            setEditExpiryByJob(prev => ({
                ...prev,
                [jobId]: res.data.expiresAt
                    ? new Date(res.data.expiresAt).toISOString().split('T')[0]
                    : ''
            }));

        } catch (error) {
            console.error('Failed to update expiry date:', error);
        }
    };

    const handleDownloadApplicationDocument = async (applicationId, documentId, documentName) => {
        try {
            const res = await downloadApplicationDocumentsForEmployer(applicationId, documentId);

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', documentName || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download applicant document:', error);
            alert(error?.response?.data?.message || 'Failed to download document');
        }
    };

    const toggleApplicantDetails = (applicationId) => {
        setShowApplicantDetails(prev => ({
            ...prev,
            [applicationId]: !prev[applicationId]
        }));
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
                    <div className="empty-icon">✉︎</div>
                    <h3>No jobs posted yet</h3>
                    <p>Create your first job posting in the Post Job tab!</p>
                </div>
            ) : (
                <ul className="job-list">
                    {myJobs.map(job => {
                        const displayStatus = getDisplayJobStatus(job);

                        return (
                            <li key={job.id} className="job-card">
                                <div className="job-card-content">
                                    <div className="job-header">
                                        <h3>{job.title}</h3>
                                        <span className={`status-badge status-${displayStatus.toLowerCase()}`}>
                                            {displayStatus}
                                        </span>
                                    </div>

                                    <div className="job-meta">
                                        <span>✈︎ {job.location || 'Remote'} ✈︎</span>
                                        <span>$ {job.minSalary?.toLocaleString() || 'Negotiable'} $</span>
                                        <span>◴ {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'N/A'} ◴</span>
                                        <span>ⴵ Expires: {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiry'} ⴵ</span>
                                    </div>

                                    <p className="job-description">
                                        {job.description ?
                                            (job.description.length > 200 ?
                                                `${job.description.substring(0, 200)}...` :
                                                job.description) :
                                            'No description provided'}
                                    </p>

                                    <div
                                        className="job-actions"
                                        style={{display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px'}}
                                    >
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
                                            onClick={() => handleJobStatusChange(job.id, 'OPEN')}
                                            disabled={displayStatus === 'OPEN'}
                                        >
                                            Open
                                        </button>

                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleJobStatusChange(job.id, 'CLOSED')}
                                            disabled={displayStatus === 'CLOSED'}
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
                                    <div style={{
                                        marginTop: '12px',
                                        display: 'flex',
                                        gap: '8px',
                                        flexWrap: 'wrap',
                                        alignItems: 'center'
                                    }}>
                                        <input
                                            type="date"
                                            value={editExpiryByJob[job.id] || (job.expiresAt ? new Date(job.expiresAt).toISOString().split('T')[0] : '')}
                                            onChange={(e) =>
                                                setEditExpiryByJob(prev => ({
                                                    ...prev,
                                                    [job.id]: e.target.value
                                                }))
                                            }
                                            className="form-control"
                                            style={{width: '180px'}}
                                        />

                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleUpdateExpiry(job.id)}
                                        >
                                            Save Expiry
                                        </button>
                                    </div>


                                    {showSkills === job.id && (
                                        <div className="detail-box" style={{marginTop: '16px'}}>
                                            <h4>Required Skills</h4>

                                            {loadingSkillsByJob[job.id] ? (
                                                <p>Loading skills...</p>
                                            ) : (
                                                <>
                                                    <div
                                                        style={{
                                                            marginBottom: '16px',
                                                            display: 'flex',
                                                            gap: '10px',
                                                            flexWrap: 'wrap'
                                                        }}
                                                    >
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
                                                            style={{width: '140px'}}
                                                        />

                                                        <button
                                                            className="btn btn-primary btn-sm"
                                                            onClick={() => handleAddJobSkill(job.id)}
                                                        >
                                                            Add Skill
                                                        </button>
                                                    </div>

                                                    {(jobSkillsMap[job.id] || []).length === 0 ? (
                                                        <p style={{color: '#7f8c8d'}}>No skills added yet.</p>
                                                    ) : (
                                                        <ul className="applicants-list">
                                                            {(jobSkillsMap[job.id] || []).map(skill => (
                                                                <li key={skill.id} className="applicant-item">
                                                                    <div className="applicant-info">
                                                                        <strong>{skill.skillName}</strong>
                                                                        <div
                                                                            style={{
                                                                                marginTop: '8px',
                                                                                display: 'flex',
                                                                                gap: '10px',
                                                                                alignItems: 'center',
                                                                                flexWrap: 'wrap'
                                                                            }}
                                                                        >
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
                                                                                style={{width: '140px'}}
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
                                                                            onClick={() => handleDeleteJobSkill(job.id, skill)}
                                                                        >
                                                                            Remove
                                                                        </button>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {selectedJobId === job.id && (
                                        <div className="detail-box" style={{marginTop: '16px'}}>
                                            <h4>Applicants for "{job.title}"</h4>

                                            {loadingApplicants ? (
                                                <p style={{color: '#7f8c8d', textAlign: 'center', padding: '20px'}}>
                                                    Loading applicants...
                                                </p>
                                            ) : applications.length === 0 ? (
                                                <p style={{color: '#7f8c8d', textAlign: 'center', padding: '20px'}}>
                                                    No applicants yet.
                                                </p>
                                            ) : (
                                                <ul className="applicants-list">
                                                    {applications.map(app => (

                                                        <li key={app.applicationId} className="applicant-item">
                                                            <div style={{
                                                                display: 'flex',
                                                                justifyContent: 'space-between',
                                                                gap: '16px',
                                                                flexWrap: 'wrap'
                                                            }}>
                                                        <div>
                                                            <strong>{app.applicantFullName || 'Unknown'}</strong>
                                                            <div style={{color: '#7f8c8d', fontSize: '0.9rem'}}>
                                                                {app.applicantEmail}
                                                            </div>
                                                            <div style={{
                                                                color: '#2563eb',
                                                                fontWeight: 600,
                                                                marginTop: '4px'
                                                            }}>
                                                                Match Score: {app.matchScore ?? 'N/A'}%
                                                            </div>
                                                            <div style={{color: '#666', fontSize: '0.85rem'}}>
                                                                Status: {app.status || 'SUBMITTED'}
                                                            </div>
                                                        </div>

                                                        <div style={{
                                                            display: 'flex',
                                                            gap: '8px',
                                                            flexWrap: 'wrap',
                                                            alignItems: 'flex-start'
                                                        }}>
                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={() => toggleApplicantDetails(app.applicationId)}
                                                            >
                                                                {showApplicantDetails[app.applicationId] ? 'Hide Details' : 'View Details'}
                                                            </button>

                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={() => handleSaveEmployerNotes(app.applicationId, app.status || 'SUBMITTED')}
                                                            >
                                                                Save Notes
                                                            </button>

                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={() => handleApplicationStatusChange(app.applicationId, 'SHORTLISTED')}
                                                                disabled={app.status === 'SHORTLISTED'}
                                                            >
                                                                Shortlist
                                                            </button>

                                                            <button
                                                                className="btn btn-outline btn-sm"
                                                                onClick={() => handleApplicationStatusChange(app.applicationId, 'REJECTED')}
                                                                disabled={app.status === 'REJECTED'}
                                                            >
                                                                Reject
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {showApplicantDetails[app.applicationId] && (
                                                        <div className="detail-box" style={{marginTop: '12px'}}>
                                                            {app.reviewedAt && (
                                                                <div style={{color: '#666', fontSize: '0.85rem'}}>
                                                                    Reviewed: {new Date(app.reviewedAt).toLocaleString()}
                                                                </div>
                                                            )}

                                                            {app.whyGoodFit && (
                                                                <div style={{marginTop: '10px'}}>
                                                                    <strong>Why good fit</strong>
                                                                    <div>{app.whyGoodFit}</div>
                                                                </div>
                                                            )}

                                                            {(app.expectedSalary || app.availableStartDate) && (
                                                                <div style={{
                                                                    marginTop: '10px',
                                                                    color: '#666',
                                                                    fontSize: '0.85rem'
                                                                }}>
                                                                    {app.expectedSalary && <div>Expected Salary:
                                                                        ${Number(app.expectedSalary).toLocaleString()}</div>}
                                                                    {app.availableStartDate && <div>Available Start
                                                                        Date: {new Date(app.availableStartDate).toLocaleDateString()}</div>}
                                                                </div>
                                                            )}

                                                            {app.applicantDocuments && app.applicantDocuments.length > 0 && (
                                                                <div style={{ marginTop: '12px' }}>
                                                                    <strong>Documents</strong>
                                                                    <div style={{ marginTop: '8px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                                        {app.applicantDocuments.map(doc => (
                                                                            <button
                                                                                key={doc.documentId}
                                                                                type="button"
                                                                                className="btn btn-outline btn-sm"
                                                                                onClick={() =>
                                                                                    handleDownloadApplicationDocument(
                                                                                        app.applicationId,
                                                                                        doc.documentId,
                                                                                        doc.documentName
                                                                                    )
                                                                                }
                                                                            >
                                                                                {doc.documentType}: {doc.documentName}
                                                                            </button>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            <div style={{marginTop: '10px'}}>
                                                                <textarea
                                                                    className="form-control"
                                                                    rows="3"
                                                                    placeholder="Notes to employee"
                                                                    value={employerNotesByApplication[app.applicationId] ?? app.employerNotes ?? ''}
                                                                    onChange={(e) =>
                                                                        setEmployerNotesByApplication(prev => ({
                                                                            ...prev,
                                                                            [app.applicationId]: e.target.value
                                                                        }))
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                                )}
                            </div>
                    </li>
                    )
                        ;
                    })}
                </ul>
            )}
        </div>
    );
}

export default MyJobsTab;