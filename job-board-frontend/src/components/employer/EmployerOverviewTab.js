import React, { useEffect, useState } from 'react';
import { getEmployerApplications } from '../../api/api';

function EmployerOverviewTab() {
    const [allApplications, setAllApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const response = await getEmployerApplications();
            setAllApplications(response.data || []);
        } catch (error) {
            console.error('Failed to load employer applications:', error);
            alert('Failed to load recent applications.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading overview...</div>;
    }

    return (
        <div className="tab-panel">
            <h2>Recent Applications</h2>

            {allApplications.length === 0 ? (
                <p style={{ color: '#7f8c8d' }}>
                    No applications yet. Post more jobs to attract candidates!
                </p>
            ) : (
                <div className="applications-summary">
                    <p className="summary-count"> {allApplications.length} total application{allApplications.length !== 1 ? 's' : ''}</p>

                    <ul className="application-list">
                        {allApplications.slice(0, 10).map(app => (
                            <li key={app.applicationId}>
                                <strong>{app.applicantFullName || 'Candidate'}</strong> applied for{' '}
                                <strong>{app.jobTitle || 'Job'}</strong>
                                <span className="date-badge">
                                    {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                                <div style={{marginTop: '6px', color: '#2563eb', fontWeight: '600'}}>
                                    Match Score: {app.matchScore ?? 'N/A'}%
                                </div>
                                <div style={{marginTop: '6px', fontSize: '0.9rem', color: '#555'}}>
                                    Skills: {app.skillScore ?? 'N/A'}% |
                                    Title: {app.titleScore ?? 'N/A'}% |
                                    Location: {app.locationScore ?? 'N/A'}% |
                                    Salary: {app.salaryScore ?? 'N/A'}% |
                                    Job Type: {app.jobTypeScore ?? 'N/A'}%
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default EmployerOverviewTab;