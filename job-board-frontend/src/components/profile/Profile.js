import React, {useState, useEffect} from 'react';
import {getProfileCompletion} from "../../api/api.js";
import ProfileCompletion from './ProfileCompletion';
import ExperienceSection from './ExperienceSection';
import EducationSection from './EducationSection';
import DocumentsSection from './DocumentSection';
import SkillsSection from './SkillsSection';
import PreferenceSection from "./PreferenceSection";
import CompanyProfileSection from "./CompanyProfileSection";
import './ProfileStyle.css';
import BasicInfoSection from "./BasicInfoSection";

function ProfilePage({role}) {
    const [activeTab, setActiveTab] = useState(role === 'EMPLOYEE'? 'basic' : 'company');
    const [completion, setCompletion] = useState({
        completionScore: 0,
        hasBasicInfo: false,
        hasSkills: false,
        hasCv: false,
        hasExperience: false,
        hasEducation: false
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProfileCompletion();
    }, []);

    const loadProfileCompletion = async () => {
        try {
            const response = await getProfileCompletion();
            setCompletion(response.data);
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
                <ProfileCompletion completion={completion} />
            </div>


            <div className="profile-tabs">

                {role === 'EMPLOYEE' && (
                    <>
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
                            className={activeTab === 'education' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('education')}
                        >
                            Education
                        </button>

                        <button
                            className={activeTab === 'documents' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('documents')}
                        >
                            Documents
                        </button>

                        <button
                            className={activeTab === 'skills' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('skills')}
                        >
                            Skills
                        </button>
                        <button
                            className={activeTab === 'preferences' ? 'tab active' : 'tab'}
                            onClick={() => setActiveTab('preferences')}
                        >
                            Job Preferences
                        </button>
                    </>
                )}
                {role === 'EMPLOYER' && (
                    <button
                        className={activeTab === 'company' ? 'tab active' : 'tab'}
                        onClick={() => setActiveTab('company')}
                    >
                        Company Profile
                    </button>
                )}
            </div>

            <div className="profile-content">
                {activeTab === 'basic' && role === 'EMPLOYEE' && (
                    <BasicInfoSection onUpdate={handleProfileUpdate}/>
                )}
                {activeTab === 'experience' && role === 'EMPLOYEE' && (
                    <ExperienceSection onUpdate={handleProfileUpdate} />
                )}
                {activeTab === 'education' && role === 'EMPLOYEE' && (
                    <EducationSection onUpdate={handleProfileUpdate} />
                )}
                {activeTab === 'documents' && role === 'EMPLOYEE' && (
                    <DocumentsSection onUpdate={handleProfileUpdate} />
                )}
                {activeTab === 'skills' && role === 'EMPLOYEE' && (
                    <SkillsSection onUpdate={handleProfileUpdate} />
                )}
                {activeTab === 'preferences' && role === 'EMPLOYEE' && (
                    <PreferenceSection onUpdate={handleProfileUpdate} />
                )}

                {/*Company*/}
                {activeTab === 'company' && role === 'EMPLOYER' && (
                    <CompanyProfileSection onUpdate={handleProfileUpdate} />
                )}
            </div>
        </div>
    );
};

export default ProfilePage;