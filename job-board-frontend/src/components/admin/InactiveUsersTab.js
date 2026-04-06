import React, { useState, useEffect } from 'react';
import { getInactiveUsers, banUser } from '../../api/api';
import './Admin.css';

const InactiveUsersTab = () => {
    const [inactiveUsers, setInactiveUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadInactiveUsers();
    }, []);

    const loadInactiveUsers = async () => {
        try {
            setError(null);
            const response = await getInactiveUsers();
            setInactiveUsers(response.data);
        } catch (error) {
            console.error('Error loading inactive users:', error);
            setError('No users have been inactive for 40+ days.');
            setInactiveUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId, userName) => {
        if (!window.confirm(
            `${userName} has been inactive for ${getDaysInactive(userId)} days.\n\n` +
            `Are you sure to ban ${userName}?`
        )) {
            return;
        }

        try {
            await banUser(userId);
            alert('User banned successfully');
            await loadInactiveUsers();
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban user');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getDaysInactive = (userId) => {
        const user = inactiveUsers.find(u => u.id === userId);
        return user ? user.daysInactive : 0;
    };

    const getInactivityLevel = (days) => {
        if (days >= 60) return 'critical';
        if (days >= 50) return 'high';
        if (days >= 40) return 'medium';
        return 'low';
    };

    const getRoleBadgeClass = (role) => {
        switch(role) {
            case 'EMPLOYER': return 'badge-employer';
            case 'EMPLOYEE': return 'badge-employee';
            default: return 'badge-default';
        }
    };

    if (loading) {
        return <div className="loading">Loading inactive users...</div>;
    }

    return (
        <div className="inactive-users-tab">
            <div className="inactive-header">
                <div>
                    <h2>Inactive Users (40+ Days)</h2>
                    <p>Users who haven't logged in for 40 or more days</p>
                </div>
                <button className="btn-refresh" onClick={loadInactiveUsers}>
                    Refresh
                </button>
            </div>

            {inactiveUsers.length === 0 ? (
                <div className="empty-state success">
                    <div className="success-icon">✓</div>
                    <h3>No Inactive Users</h3>
                    <p>All users have logged in within the last 40 days!</p>
                </div>
            ) : (
                <>
                    <div className="alert-banner warning">
                        <strong>⚠️ Warning:</strong> {inactiveUsers.length} user{inactiveUsers.length !== 1 ? 's' : ''} {inactiveUsers.length !== 1 ? 'have' : 'has'} been inactive for 40+ days
                    </div>

                    <div className="inactive-users-grid">
                        {inactiveUsers.map(user => (
                            <div
                                key={user.id}
                                className={`inactive-user-card ${getInactivityLevel(user.daysInactive)}`}
                            >
                                <div className="card-header">
                                    <div className="user-info">
                                        <h3>{user.fullName}</h3>
                                        <p className="user-email">{user.email}</p>
                                    </div>
                                    <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                        {user.role}
                                    </span>
                                </div>

                                <div className="card-body">
                                    <div className="info-row">
                                        <span className="label">Last Login:</span>
                                        <span className="value">{formatDate(user.lastLoginAt)}</span>
                                    </div>

                                    <div className="info-row highlight">
                                        <span className="label">Days Inactive:</span>
                                        <span className="value days-count">
                                            <strong>{user.daysInactive}</strong> days
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <span className="label">Warning Email:</span>
                                        <span className={`value ${user.warningEmailSent ? 'sent' : 'not-sent'}`}>
                                            {user.warningEmailSent ? '✓ Sent' : '✗ Not Sent'}
                                        </span>
                                    </div>

                                    <div className="info-row">
                                        <span className="label">Account Status:</span>
                                        <span className={`status-badge ${user.isActive ? 'status-active' : 'status-banned'}`}>
                                            {user.isActive ? 'Active' : 'Banned'}
                                        </span>
                                    </div>
                                </div>

                                <div className="card-footer">
                                    {user.isActive && (
                                        <button
                                            className="btn-ban-user"
                                            onClick={() => handleBanUser(user.id, user.fullName)}
                                        >
                                            Ban User
                                        </button>
                                    )}
                                    {!user.isActive && (
                                        <div className="banned-notice">
                                            ✗ Already Banned
                                        </div>
                                    )}
                                </div>

                                {user.daysInactive >= 60 && (
                                    <div className="critical-badge">
                                        CRITICAL: 60+ days inactive
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="inactive-stats">
                        <div className="stat-card critical">
                            <div className="stat-value">
                                {inactiveUsers.filter(u => u.daysInactive >= 60).length}
                            </div>
                            <div className="stat-label">60+ Days</div>
                        </div>
                        <div className="stat-card high">
                            <div className="stat-value">
                                {inactiveUsers.filter(u => u.daysInactive >= 50 && u.daysInactive < 60).length}
                            </div>
                            <div className="stat-label">50-59 Days</div>
                        </div>
                        <div className="stat-card medium">
                            <div className="stat-value">
                                {inactiveUsers.filter(u => u.daysInactive >= 40 && u.daysInactive < 50).length}
                            </div>
                            <div className="stat-label">40-49 Days</div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-value">
                                {inactiveUsers.filter(u => u.warningEmailSent).length}
                            </div>
                            <div className="stat-label">Emails Sent</div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default InactiveUsersTab;