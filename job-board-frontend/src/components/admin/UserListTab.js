import React, { useState, useEffect } from 'react';
import { getAllUsers, banUser, reactivateUser } from '../../api/api';
import '../admin/Admin.css';

const AllUsersTab = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterRole, setFilterRole] = useState('ALL');
    const [filterStatus, setFilterStatus] = useState('ALL');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await getAllUsers();
            setUsers(response.data);
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleBanUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to ban ${userName}?`)) {
            return;
        }

        try {
            await banUser(userId);
            alert('User banned successfully');
            await loadUsers();
        } catch (error) {
            console.error('Error banning user:', error);
            alert('Failed to ban user');
        }
    };

    const handleReactivateUser = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to reactivate ${userName}?`)) {
            return;
        }

        try {
            await reactivateUser(userId);
            alert('User reactivated successfully');
            await loadUsers();
        } catch (error) {
            console.error('Error reactivating user:', error);
            alert('Failed to reactivate user');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDaysSinceLogin = (lastLoginAt) => {
        if (!lastLoginAt) return 'Never logged in';
        const lastLogin = new Date(lastLoginAt);
        const now = new Date();
        const diffTime = Math.abs(now - lastLogin);
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 0 ? 'Today' : `${diffDays} days ago`;
    };

    // Determine user status for display
    const getUserStatus = (user) => {
        // If never logged in AND employer AND not active → Waiting for approval
        if (!user.lastLoginAt && user.role === 'EMPLOYER' && !user.isActive) {
            return { type: 'pending', label: 'Waiting for Approval' };
        }

        // If banned
        if (!user.isActive) {
            return { type: 'banned', label: '✗ Banned' };
        }

        // Active
        return { type: 'active', label: '✓ Active' };
    };

    const getFilteredUsers = () => {
        return users.filter(user => {
            const matchesSearch =
                user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesRole = filterRole === 'ALL' || user.role === filterRole;

            const status = getUserStatus(user);
            const matchesStatus =
                filterStatus === 'ALL' ||
                (filterStatus === 'ACTIVE' && status.type === 'active') ||
                (filterStatus === 'BANNED' && status.type === 'banned') ||
                (filterStatus === 'PENDING' && status.type === 'pending');

            return matchesSearch && matchesRole && matchesStatus;
        });
    };

    const getRoleBadgeClass = (role) => {
        switch(role) {
            case 'ADMIN': return 'badge-admin';
            case 'EMPLOYER': return 'badge-employer';
            case 'EMPLOYEE': return 'badge-employee';
            default: return 'badge-default';
        }
    };

    const getStats = () => {
        const activeUsers = users.filter(u => u.isActive).length;
        const bannedUsers = users.filter(u => !u.isActive && u.lastLoginAt).length;
        const pendingUsers = users.filter(u => !u.lastLoginAt && u.role === 'EMPLOYER' && !u.isActive).length;
        const employees = users.filter(u => u.role === 'EMPLOYEE').length;
        const employers = users.filter(u => u.role === 'EMPLOYER').length;
        const admins = users.filter(u => u.role === 'ADMIN').length;

        return { activeUsers, bannedUsers, pendingUsers, employees, employers, admins };
    };

    if (loading) {
        return <div className="loading">Loading users...</div>;
    }

    const filteredUsers = getFilteredUsers();
    const stats = getStats();

    return (
        <div className="all-users-tab">
            <div className="users-header">
                <h2>All Users ({users.length})</h2>
                <button className="btn-refresh" onClick={loadUsers}>
                    🔄 Refresh
                </button>
            </div>

            {/* Stats */}
            <div className="users-stats">
                <div className="stat-card stat-active">
                    <div className="stat-icon">✓</div>
                    <div className="stat-value">{stats.activeUsers}</div>
                    <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-card stat-pending">
                    <div className="stat-icon">⏳</div>
                    <div className="stat-value">{stats.pendingUsers}</div>
                    <div className="stat-label">Pending Approval</div>
                </div>
                <div className="stat-card stat-banned">
                    <div className="stat-icon">✗</div>
                    <div className="stat-value">{stats.bannedUsers}</div>
                    <div className="stat-label">Banned Users</div>
                </div>
            </div>

            {/* Roles breakdowm*/}
            <div className="role-breakdown">
                <h3 className="breakdown-title">User Distribution</h3>
                <div className="breakdown-container">
                    {/* Employee Bar */}
                    <div className="breakdown-row">
                        <div className="breakdown-bar-main">
                            <div
                                className="breakdown-segment active employee"
                                style={{ width: `${(users.filter(u => u.role === 'EMPLOYEE' && u.isActive).length / stats.employees) * 100}%` }}
                            />
                            <div
                                className="breakdown-segment banned employee"
                                style={{ width: `${(users.filter(u => u.role === 'EMPLOYEE' && !u.isActive).length / stats.employees) * 100}%` }}
                            />
                        </div>
                        <div className="breakdown-info">
                            <div className="breakdown-label-row">
                                <span className="badge badge-employee">EMPLOYEE</span>
                                <strong className="breakdown-total">{stats.employees}</strong>
                            </div>
                            <div className="breakdown-details">
                                <span className="detail-item">
                                    <span className="detail-dot active-dot"></span>
                                    Active: {users.filter(u => u.role === 'EMPLOYEE' && u.isActive).length}
                                </span>
                                <span className="detail-item">
                                    <span className="detail-dot banned-dot"></span>
                                    Banned: {users.filter(u => u.role === 'EMPLOYEE' && !u.isActive).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Employer Bar */}
                    <div className="breakdown-row">
                        <div className="breakdown-bar-main">
                            <div
                                className="breakdown-segment active employer"
                                style={{width: `${(users.filter(u => u.role === 'EMPLOYER' && u.isActive).length / stats.employers) * 100}%`}}
                            />
                            <div
                                className="breakdown-segment banned employer"
                                style={{width: `${(users.filter(u => u.lastLoginAt && !u.isActive).length / stats.employers) * 100}%`}}
                            />
                            <div
                                className="breakdown-segment pending employer"
                                style={{width: `${(users.filter(u => !u.lastLoginAt && u.role === 'EMPLOYER' && !u.isActive).length / stats.employers) * 100}%`}}
                            />
                        </div>
                        <div className="breakdown-info">
                            <div className="breakdown-label-row">
                                <span className="badge badge-employer">EMPLOYER</span>
                                <strong className="breakdown-total">{stats.employers}</strong>
                            </div>
                            <div className="breakdown-details">
                                <span className="detail-item">
                                    <span className="detail-dot active-dot"></span>
                                    Active: {users.filter(u => u.role === 'EMPLOYER' && u.isActive).length}
                                </span>
                                <span className="detail-item">
                                    <span className="detail-dot banned-dot"></span>
                                    Banned: {users.filter(u => !u.isActive && u.lastLoginAt).length}
                                </span>
                                <span className="detail-item">
                                    <span className="detail-dot pending-dot"></span>
                                    Pending: {users.filter(u => !u.lastLoginAt && u.role === 'EMPLOYER' && !u.isActive).length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Admin Bar */}
                    <div className="breakdown-row">
                        <div className="breakdown-bar-main">
                            <div
                                className="breakdown-segment active admin"
                                style={{ width: `${stats.admins > 0 ? (users.filter(u => u.role === 'ADMIN' && u.isActive).length / stats.admins) * 100 : 0}%` }}
                            />
                            <div
                                className="breakdown-segment banned admin"
                                style={{ width: `${stats.admins > 0 ? (users.filter(u => u.role === 'ADMIN' && !u.isActive).length / stats.admins) * 100 : 0}%` }}
                            />
                        </div>
                        <div className="breakdown-info">
                            <div className="breakdown-label-row">
                                <span className="badge badge-admin">ADMIN</span>
                                <strong className="breakdown-total">{stats.admins}</strong>
                            </div>
                            <div className="breakdown-details">
                                <span className="detail-item active-item">
                                    <span className="detail-dot active-dot"></span>
                                    Active: {users.filter(u => u.role === 'ADMIN' && u.isActive).length}
                                </span>
                                <span className="detail-item banned-item">
                                    <span className="detail-dot banned-dot"></span>
                                    Banned: {users.filter(u => u.role === 'ADMIN' && !u.isActive).length}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="users-filters">
                <input
                    type="text"
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />

                <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="filter-select"
                >
                    <option value="ALL">All Roles</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EMPLOYER">Employer</option>
                    <option value="EMPLOYEE">Employee</option>
                </select>

                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="filter-select"
                >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="PENDING">Pending Approval</option>
                    <option value="BANNED">Banned</option>
                </select>
            </div>

            {filteredUsers.length === 0 ? (
                <div className="empty-state">
                    <p>No users found</p>
                </div>
            ) : (
                <div className="users-table-container">
                    <table className="users-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Last Login</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map(user => {
                            const status = getUserStatus(user);
                            return (
                                <tr key={user.id} className={status.type === 'banned' ? 'banned-row' : status.type === 'pending' ? 'pending-row' : ''}>
                                    <td>{user.id}</td>
                                    <td className="user-name">{user.fullName}</td>
                                    <td className="user-email">{user.email}</td>
                                    <td>
                                            <span className={`badge ${getRoleBadgeClass(user.role)}`}>
                                                {user.role}
                                            </span>
                                    </td>
                                    <td>
                                            <span className={`status-badge status-${status.type}`}>
                                                {status.label}
                                            </span>
                                    </td>
                                    <td>{formatDate(user.createdAt)}</td>
                                    <td>
                                        <div className="last-login">
                                            {formatDate(user.lastLoginAt)}
                                            <small className="login-days">
                                                {getDaysSinceLogin(user.lastLoginAt)}
                                            </small>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            {status.type === 'pending' ? (
                                                <span className="pending-note">Awaiting approval</span>
                                            ) : user.isActive ? (
                                                <button
                                                    className="btn-ban"
                                                    onClick={() => handleBanUser(user.id, user.fullName)}
                                                    disabled={user.role === 'ADMIN'}
                                                    title={user.role === 'ADMIN' ? 'Cannot ban admin' : 'Ban user'}
                                                >
                                                    Ban
                                                </button>
                                            ) : (
                                                <button
                                                    className="btn-reactivate"
                                                    onClick={() => handleReactivateUser(user.id, user.fullName)}
                                                >
                                                    Reactivate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AllUsersTab;