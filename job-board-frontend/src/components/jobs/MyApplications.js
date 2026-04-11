import React, {useEffect, useState} from 'react';
import {getEmployeeApplications, withdrawApplication} from "../../api/api";

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
        try {
            await withdrawApplication(applicationId);
            setApplications(prev =>
                prev.map(app =>
                    app.id === applicationId
                        ? { ...app, status: 'WITHDRAWN' }
                        : app
                )
            );

            alert('Application withdrawn');
        } catch (error) {
            console.error('Withdraw failed', error);
            alert('Could not withdraw application');
        }
    };

    if (loading) {
        return <p>Loading applications...</p>;
    }

    if (applications.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3>No applications yet</h3>
                <p>You have not applied to any jobs yet.</p>
            </div>
        );
    }

    return (
        <div className="applications-page">
            <h2>My Applications</h2>

            {
            applications.map(app => (
                <div key={app.id} className="application-card">
                    <h3>{app.job?.title}</h3>

                    <p><strong>Location:</strong> {app.job?.location}</p>
                    <p><strong>Status:</strong> {app.status}</p>
                    <p><strong>Match Score:</strong> {app.matchScore?.toFixed(2)}%</p>
                    <p><strong>Applied On:</strong> {app.createdAt?.slice(0, 10)}</p>

                    {app.employerNotes && (
                        <p><strong>Employer Notes:</strong> {app.employerNotes}</p>
                    )}

                    {(app.status !== 'ACCEPTED' &&
                        app.status !== 'REJECTED' &&
                        app.status !== 'WITHDRAWN') && (
                        <button onClick={() => handleWithdraw(app.id)}>
                            Withdraw
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
}

export default MyApplications;