import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './admin/Admin.css';
// Admin page
import AllUsersTab from './admin/UserListTab';
import InactiveUsersTab from './admin/InactiveUsersTab';
import PendingApprovalsTab from './admin/PendingApprovalsTab';
// Jobs
import BrowseJobsTab from './jobs/BrowseJobsTab';
import MyApplications from './jobs/MyApplications';
// Emploter page
import EmployerOverviewTab from './employer/EmployerOverviewTab';
import PostJobTab from './employer/PostJobTab';
import MyJobsTab from './employer/MyJobsTab';

function Dashboard({ role }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const initialTab = useMemo(() => {
        if (role === 'ADMIN') return 'pending';
        if (role === 'EMPLOYER') return 'overview';
        if (role === 'EMPLOYEE') return 'browse-jobs';
        return 'overview';
    }, [role]);

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(JSON.parse(userData));
    }, [navigate]);

    if (!user) {
        return <div className="loading">Loading...</div>;
    }

    if (role === 'ADMIN') {
        return (
            <div className="dashboard-container">
                <div className="dashboard-title-bar">
                    <h1>Admin Dashboard</h1>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={activeTab === 'pending' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Approvals
                    </button>

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
                        Inactive Users
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'pending' && <PendingApprovalsTab/>}
                    {activeTab === 'all-users' && <AllUsersTab/>}
                    {activeTab === 'inactive-users' && <InactiveUsersTab/>}
                </div>
            </div>
        );
    }

    if (role === 'EMPLOYER') {
        return (
            <div className="dashboard-container">
                <div className="dashboard-title-bar">
                    <h1>Employer Dashboard</h1>
                </div>

                <div className="dashboard-tabs">
                    <button
                        className={activeTab === 'overview' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('overview')}
                    >
                        Overview
                    </button>

                    <button
                        className={activeTab === 'post-job' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('post-job')}
                    >
                        Post Job
                    </button>

                    <button
                        className={activeTab === 'my-jobs' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('my-jobs')}
                    >
                        My Jobs
                    </button>
                </div>

                <div className="dashboard-content">
                    {activeTab === 'overview' && <EmployerOverviewTab/>}
                    {activeTab === 'post-job' && <PostJobTab/>}
                    {activeTab === 'my-jobs' && <MyJobsTab/>}
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <div className="dashboard-title-bar">
                <h1>Employee Dashboard</h1>
            </div>

            <div className="dashboard-tabs">
                <button
                    className={activeTab === 'browse-jobs' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('browse-jobs')}
                >
                    Browse Jobs
                </button>

                <button
                    className={activeTab === 'my-applications' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('my-applications')}
                >
                    My Applications
                </button>
            </div>

            <div className="dashboard-content">
                {activeTab === 'browse-jobs' && <BrowseJobsTab/>}
                {activeTab === 'my-applications' && <MyApplications/>}
            </div>
        </div>
    );
}

export default Dashboard;