import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile } from "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/api/api.js";
import '/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/components/profile/ProfileStyle.css';

const BasicProfileSection = ({ onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        bio: '',
        phone: '',
        address: '',
        linkedinUrl: '',
        portfolioUrl: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const response = await getProfile();
            const user = response.data;

            setFormData({
                fullName: user.fullName || '',
                email: user.email || '',
                bio: user.bio || '',
                phone: user.phone || '',
                address: user.address || '',
                linkedinUrl: user.linkedinUrl || '',
                portfolioUrl: user.portfolioUrl || ''
            });
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProfile(formData);
            alert('Profile updated successfully!');
            if (onUpdate) onUpdate();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading profile...</div>;
    }

    return (
        <div className="basic-profile-section">
            <div className="section-header">
                <h2>Basic Information</h2>
            </div>

            <form className="profile-form" onSubmit={handleSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>Full Name *</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                            style={{ backgroundColor: '#f0f0f0', cursor: 'not-allowed' }}
                        />
                        <small>Email cannot be changed</small>
                    </div>
                </div>

                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        placeholder="Tell us about yourself..."
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            placeholder="+44 (0)1234567890"
                        />
                    </div>

                    <div className="form-group">
                        <label>Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleInputChange}
                            placeholder="City, Country"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>LinkedIn URL</label>
                        <input
                            type="url"
                            name="linkedinUrl"
                            value={formData.linkedinUrl}
                            onChange={handleInputChange}
                            placeholder="https://linkedin.com/in/yourname"
                        />
                    </div>

                    <div className="form-group">
                        <label>Portfolio URL</label>
                        <input
                            type="url"
                            name="portfolioUrl"
                            value={formData.portfolioUrl}
                            onChange={handleInputChange}
                            placeholder="https://yourportfolio.com"
                        />
                    </div>
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-save" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default BasicProfileSection;