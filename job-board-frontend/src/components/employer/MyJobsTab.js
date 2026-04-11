import React, { useEffect, useState } from 'react';
import { getMyJobs, fetchApplications, getCvDownloadUrl } from '../../api/api';

function MyJobsTab() {
    const [myJobs, setMyJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyJobs();
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

    if (loading) {
        return <div className="loading">Loading your jobs...</div>;
    }

    return (
        <div className="tab-panel">
            <div className="section-header">
                <h2>Your Job Posts</h2>
                <button className="btn btn-outline" onClick={loadMyJobs}>
                    🔄 Refresh
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

                                <div style={{color: '#2563eb', fontSize: '0.9rem'}}>
                                    Match Score: {app.matchScore ?? 'N/A'}%
                                </div>

                                <div className="job-actions">
                                    <button
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleViewApplicants(job.id)}
                                    >
                                        {selectedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
                                    </button>
                                </div>

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
                                                            <strong>{app.applicant?.fullName || 'Unknown'}</strong>
                                                            <div style={{color: '#7f8c8d', fontSize: '0.9rem'}}>
                                                                {app.applicant?.email}
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
                                                            {app.applicant?.cv ? (
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