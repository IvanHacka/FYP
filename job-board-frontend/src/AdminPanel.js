import React, { useState } from 'react';
import AllUsersTab from './components/admin/UserListTab';
import InactiveUsersTab from './components/admin/InactiveUsersTab';
import './components/admin/Admin.css';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('all-users');

    return (
        <div className="admin-panel">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage users and monitor account activity</p>
            </div>

            <div className="admin-tabs">
                <button
                    className={activeTab === 'all-users' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('all-users')}
                >
                    All Users
                </button>
                <button
                    className={activeTab === 'inactive-users' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('inactive-users')}
                >
                    Inactive Users (40+ days)
                </button>
            </div>

            <div className="admin-content">
                {activeTab === 'all-users' && <AllUsersTab />}
                {activeTab === 'inactive-users' && <InactiveUsersTab />}
            </div>
        </div>
    );
};

export default AdminPanel;