import React, { useEffect, useState } from 'react';
import { getEmployeeApplications, withdrawApplication } from "../../api/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState({});

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const res = await getEmployeeApplications();
            setApplications(res.data || []);
        } catch (error) {
            console.error('Failed to load applications', error);
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async (applicationId) => {
        const confirmed = window.confirm('Withdraw this application?');
        if (!confirmed) return;

        try {
            await withdrawApplication(applicationId);
            setApplications(prev =>
                prev.map(app =>
                    app.applicationId === applicationId
                        ? { ...app, status: 'WITHDRAWN' }
                        : app
                )
            );
        } catch (error) {
            console.error('Withdraw failed', error);
        }
    };
    const toggleDetails = (applicationId) => {
        setShowDetails(prev => ({
            ...prev,
            [applicationId]: !prev[applicationId]
        }));
    };
    const buildTimeline = (app) => {
        const timeline = [];

        if (app.createdAt) {
            timeline.push({ label: 'Application Submitted', date: app.createdAt});
        }

        if (app.reviewedAt) {
            timeline.push({ label: 'Under Review', date: app.reviewedAt});
        }

        if (app.shortlistedAt) {
            timeline.push({ label: 'Shortlisted', date: app.shortlistedAt});
        }

        if (app.rejectedAt) {
            timeline.push({ label: 'Rejected', date: app.rejectedAt });
        }

        if (app.acceptedAt) {
            timeline.push({ label: 'Rejected', date: app.acceptedAt });
        }


        return timeline;
    };

    if (loading) {
        return (
            <div className="tab-panel">
                <div className="loading">Loading applications...</div>
            </div>
        );
    }

    return (
        <div className="tab-panel">
            <div className="section-header">
                <h2>My Applications</h2>
                <button className="btn btn-outline" onClick={loadApplications}>
                    ↻ Refresh
                </button>
            </div>

            <div className="job-count">
                <strong>{applications.length}</strong> application{applications.length !== 1 ? 's' : ''}
            </div>

            {applications.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✍︎</div>
                    <h3>No applications yet</h3>
                    <p>You have not applied to any jobs yet.</p>
                </div>
            ) : (
                <ul className="job-list">
                    {applications.map(app => (
                        <li key={app.applicationId} className="job-card">
                            <div className="job-card-content">
                                <div className="job-header">
                                    <h3>{app.jobTitle || 'Untitled Job'}</h3>
                                    <span className={`status-badge status-${(app.status || 'submitted').toLowerCase()}`}>
                                        {app.status}
                                    </span>
                                </div>

                                <div className="job-meta">
                                    <span>
                                        Applied: {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </span>
                                </div>
                                {app.reviewedAt && (
                                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
                                        Reviewed: {new Date(app.reviewedAt).toLocaleString()}
                                    </div>
                                )}

                                <div className="job-match-score">
                                    {app.matchScore != null ?
                                        `Match Score: ${Number(app.matchScore).toFixed(2)}%` :
                                        'Match score unavailable'}
                                </div>

                                {app.employerNotes && (
                                    <div className="detail-box" style={{ marginTop: '12px' }}>
                                        <h4>Employer Notes</h4>
                                        <p style={{ margin: 0 }}>{app.employerNotes}</p>
                                    </div>
                                )}


                                <div
                                    className="job-actions"
                                    style={{display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px'}}
                                >
                                    <button
                                        className="btn btn-outline btn-sm"
                                        onClick={() => toggleDetails(app.applicationId)}
                                    >
                                        {showDetails[app.applicationId] ? 'Hide Details' : 'View Details'}
                                    </button>
                                    {(app.status !== 'ACCEPTED' &&
                                        app.status !== 'REJECTED' &&
                                        app.status !== 'WITHDRAWN') && (
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleWithdraw(app.applicationId)}
                                        >
                                            Withdraw
                                        </button>
                                    )}
                                </div>
                                {showDetails[app.applicationId] && (
                                    <div className="detail-box" style={{ marginTop: '12px' }}>

                                        {/* Company details */}
                                        {(app.companyName || app.companyWebsite || app.companyDescription) && (
                                            <div className="detail-box" style={{ marginBottom: '12px' }}>
                                                <h4>Company Profile</h4>

                                                {app.companyName && (
                                                    <div><strong>Company Name:</strong> {app.companyName}</div>
                                                )}

                                                {app.companyWebsite && (
                                                    <div>
                                                        <strong>Website:</strong>{' '}
                                                        <a
                                                            href={app.companyWebsite}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                        >
                                                            {app.companyWebsite}
                                                        </a>
                                                    </div>
                                                )}

                                                {app.minSalary && (
                                                    <div>
                                                        Salary: ${Number(app.minSalary).toLocaleString()}
                                                    </div>
                                                )}

                                                {app.companyDescription && (
                                                    <div style={{ marginTop: '8px' }}>
                                                        <strong>About:</strong>
                                                        <p style={{ marginTop: '4px' }}>{app.companyDescription}</p>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {/* score breakdown */}
                                        {(app.skillScore || app.salaryScore || app.locationScore) && (
                                            <>
                                                <h4>Match Breakdown</h4>
                                                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                                    <div>Skills: {app.skillScore ?? 'N/A'}%</div>
                                                    <div>Title: {app.titleScore ?? 'N/A'}%</div>
                                                    <div>Location: {app.locationScore ?? 'N/A'}%</div>
                                                    <div>Salary: {app.salaryScore ?? 'N/A'}%</div>
                                                    <div>Job Type: {app.jobTypeScore ?? 'N/A'}%</div>
                                                </div>
                                            </>
                                        )}

                                        {/* Input preferences */}
                                        {(app.whyGoodFit || app.expectedSalary || app.availableStartDate) && (
                                            <>
                                                <h4 style={{ marginTop: '12px' }}>Your Application</h4>

                                                {app.whyGoodFit && (
                                                    <div>
                                                        <strong>Why you’re a good fit:</strong>
                                                        <p>{app.whyGoodFit}</p>
                                                    </div>
                                                )}

                                                {(app.expectedSalary || app.availableStartDate) && (
                                                    <div style={{ fontSize: '0.9rem', color: '#555' }}>
                                                        {app.expectedSalary && (
                                                            <div>Expected Salary: ${Number(app.expectedSalary).toLocaleString()}</div>
                                                        )}
                                                        {app.availableStartDate && (
                                                            <div>Available Start Date: {new Date(app.availableStartDate).toLocaleDateString()}</div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* History time line */}
                                        <div style={{ marginTop: '16px' }}>
                                            <h4>Application Timeline</h4>

                                            <ul style={{
                                                listStyle: 'none',
                                                padding: 0,
                                                marginTop: '8px'
                                            }}>
                                                {buildTimeline(app).map((item, index) => (
                                                    <li
                                                        key={index}
                                                        style={{
                                                            padding: '8px 0',
                                                            borderLeft: '3px solid #2563eb',
                                                            paddingLeft: '10px',
                                                            marginBottom: '6px'
                                                        }}
                                                    >
                                                        <div style={{ fontWeight: 600 }}>{item.label}</div>

                                                        <div style={{ fontSize: '0.8rem', color: '#666' }}>
                                                            {item.date ? new Date(item.date).toLocaleString() : '—'}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

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

export default MyApplications;