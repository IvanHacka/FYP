import React, { useEffect, useState } from 'react';
import { getEmployeeApplications, withdrawApplication } from "../../api/api";

function MyApplications() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

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

                                <div className="job-match-score">
                                    {app.matchScore != null
                                        ? `Match Score: ${Number(app.matchScore).toFixed(2)}%`
                                        : 'Match score unavailable'}
                                </div>

                                {app.employerNotes && (
                                    <div className="detail-box" style={{ marginTop: '12px' }}>
                                        <h4>Employer Notes</h4>
                                        <p style={{ margin: 0 }}>{app.employerNotes}</p>
                                    </div>
                                )}

                                {app.reviewedAt && (
                                    <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#666' }}>
                                        Reviewed: {new Date(app.reviewedAt).toLocaleString()}
                                    </div>
                                )}

                                <div
                                    className="job-actions"
                                    style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}
                                >
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
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MyApplications;