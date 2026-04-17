import React, { useEffect, useState } from 'react';
import { getProfile, updateProfile } from '../../api/api';

function CompanyProfileSection({ onUpdate }) {
    const [formData, setFormData] = useState({
        companyName: '',
        companyWebsite: '',
        companyDescription: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadCompanyProfile();
    }, []);

    const loadCompanyProfile = async () => {
        try {
            const res = await getProfile();
            const data = res.data || {};

            setFormData({
                companyName: data.companyName || '',
                companyWebsite: data.companyWebsite || '',
                companyDescription: data.companyDescription || '',
                phone: data.phone || '',
                address: data.address || ''
            });
        } catch (error) {
            console.error('Failed to load company profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            await updateProfile(formData);
            alert('Company profile updated');
            onUpdate?.();
        } catch (error) {
            console.error('Failed to update company profile:', error);
            alert(error?.response?.data?.message || 'Failed to update company profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading company profile...</div>;
    }

    return (
        <form className="profile-section" onSubmit={handleSave}>
            <h2>Company Profile</h2>

            <div className="form-group">
                <label>Company Name</label>
                <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Company Website</label>
                <input
                    type="url"
                    name="companyWebsite"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="https://example.com"
                />
            </div>

            <div className="form-group">
                <label>Company Description</label>
                <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    className="form-control"
                    rows="5"
                />
            </div>

            <div className="form-group">
                <label>Phone</label>
                <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <div className="form-group">
                <label>Address</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                />
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Company Profile'}
            </button>
        </form>
    );
}

export default CompanyProfileSection;