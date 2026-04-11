import React, { useEffect, useState } from 'react';
import { fetchPendingEmployers, approveEmployers } from '../../api/api';

function PendingApprovalsTab() {
    const [pendingEmployers, setPendingEmployers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPendingEmployers();
    }, []);

    const loadPendingEmployers = async () => {
        try {
            const response = await fetchPendingEmployers();
            setPendingEmployers(response.data || []);
        } catch (error) {
            console.error('Failed to fetch pending employers:', error);
            alert('Failed to load pending employers.');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        if (!window.confirm('Are you sure you want to approve this employer?')) return;

        try {
            await approveEmployers(userId);
            alert('Employer Approved!');
            loadPendingEmployers();
        } catch (error) {
            console.error('Failed to approve employer:', error);
            alert('Failed to approve employer.');
        }
    };

    if (loading) {
        return <div className="loading">Loading pending approvals...</div>;
    }

    return (
        <div className="tab-panel">
            <h2>Pending Employer Approvals</h2>
            <p style={{ color: '#7f8c8d', marginBottom: '20px' }}>
                Review and approve pending employer registrations
            </p>

            {pendingEmployers.length === 0 ? (
                <div className="empty-state success">
                    <div className="success-icon">✓</div>
                    <h3>All Caught Up!</h3>
                    <p>No pending approvals at the moment.</p>
                </div>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Registration Date</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {pendingEmployers.map(employer => (
                            <tr key={employer.id}>
                                <td>{employer.companyName || 'N/A'}</td>
                                <td>{employer.email}</td>
                                <td>{new Date(employer.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleApprove(employer.id)}
                                        className="btn-reactivate"
                                    >
                                        Approve
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default PendingApprovalsTab;