import React, { useState, useEffect } from 'react';
import { getProfileCompletion } from "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/api/api.js";
import ProfileCompletion from './ProfileCompletion';
import ExperienceSection from './ExperienceSection';
import DocumentsSection from './DocumentSection';
import SkillsSection from './SkillsSection';
import './ProfileStyle.css';
import BasicInfoSection from "./BasicInfoSection";

function ProfilePage({role}) {
    const [activeTab, setActiveTab] = useState('basic');
    const [completion, setCompletion] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileCompletion();
    }, []);

    const loadProfileCompletion = async () => {
        try {
            const response = await getProfileCompletion();
            setCompletion(response.data.completionPercentage);
        } catch (error) {
            console.error('Error loading profile completion:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = () => {
        loadProfileCompletion();
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <h1>My Profile</h1>
                <ProfileCompletion percentage={completion} />
            </div>

            <div className="profile-tabs">

                <button
                    className={activeTab === 'basic' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('basic')}
                >
                    Basic Information
                </button>
                <button
                    className={activeTab === 'experience' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('experience')}
                >
                    Work Experience
                </button>
                <button
                    className={activeTab === 'documents' ? 'tab active' : 'tab'}
                    onClick={() => setActiveTab('documents')}
                >
                    Documents
                </button>
                {role === 'EMPLOYEE' && (
                    <button
                        className={activeTab === 'skills' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('skills')}
                    >
                        Skills
                    </button>
                )}
            </div>

            <div className="profile-content">
                {activeTab === 'basic' && (
                    <BasicInfoSection onUpdate={handleProfileUpdate}/>
                )}
                {activeTab === 'experience' && (
                    <ExperienceSection onUpdate={handleProfileUpdate} />
                )}
                {activeTab === 'documents' && (
                    <DocumentsSection onUpdate={handleProfileUpdate} />
                )}
                {activeTab === 'skills' && role === 'EMPLOYEE' && (
                    <SkillsSection onUpdate={handleProfileUpdate} />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;