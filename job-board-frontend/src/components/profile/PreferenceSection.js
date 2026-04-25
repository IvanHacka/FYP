import React, {useEffect, useState} from 'react';
import {getEmployeePreferences, updateEmployeePreferences} from "../../api/api.js";

function PreferenceSection({onUpdate}) {
    const [formData, setFormData] = useState({
        desiredJobTitle: '',
        preferredLocations: '',
        minExpectedSalary: '',
        jobTypes: [],
        availableStartDate: '',
        willingToRelocate: false
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    //
    const today = new Date().toLocaleDateString('en-CA');

    useEffect(() => {
        loadPreferences();
    }, []);

    const loadPreferences = async () => {
        try {
            const res = await getEmployeePreferences();

            setFormData({
                desiredJobTitle: res.data?.desiredJobTitle || '',
                preferredLocations: res.data?.preferredLocations || '',
                minExpectedSalary: res.data?.minExpectedSalary || '',
                jobTypes: res.data?.jobTypes || [],
                availableStartDate: res.data?.availableStartDate || '',
                willingToRelocate: res.data?.willingToRelocate || false,
            });
        } catch (error) {
            console.error('Failed to load employee preferences', error);
            setMessage('Failed to load preferences.');
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            const payload = {
                desiredJobTitle: formData.desiredJobTitle || null,
                preferredLocations: formData.preferredLocations || null,
                minExpectedSalary: formData.minExpectedSalary ? Number(formData.minExpectedSalary) : null,
                jobTypes: formData.jobTypes || null,
                availableStartDate: formData.availableStartDate || null,
                willingToRelocate: formData.willingToRelocate
            };

            await updateEmployeePreferences(payload);

            setMessage('Preferences updated successfully.');

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to update preferences', error);
            setMessage('Failed to update preferences.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading preferences...</div>;
    }

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2>Job Preferences</h2>
            </div>

            <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-group">
                    <label>Preferred Job Title</label>
                    <input
                        type="text"
                        name="desiredJobTitle"
                        value={formData.desiredJobTitle}
                        onChange={handleChange}
                        placeholder="e.g. Junior Software Developer"
                    />
                </div>

                <div className="form-group">
                    <label>Preferred Location</label>
                    <input
                        type="text"
                        name="preferredLocations"
                        value={formData.preferredLocations}
                        onChange={handleChange}
                        placeholder="e.g. London, Leicester, Remote"
                    />
                </div>

                <div className="form-group">
                    <label>Expected Salary</label>
                    <input
                        type="number"
                        name="minExpectedSalary"
                        value={formData.minExpectedSalary}
                        onChange={handleChange}
                        placeholder="e.g. 30000"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Preferred Job Type</label>
                    <select
                        multiple
                        size="5"
                        name="jobTypes"
                        value={formData.jobTypes}
                        onChange={(e) => {
                            const values = Array.from(e.target.selectedOptions, option => option.value);
                            setFormData(prev => ({
                                ...prev,
                                jobTypes: values
                            }));
                        }}
                    >
                        <option value="FULL_TIME">Full-time</option>
                        <option value="PART_TIME">Part-time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="REMOTE">Remote</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Available Start Date</label>
                    <input
                        type="date"
                        name="availableStartDate"
                        value={formData.availableStartDate}
                        min={today}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            name="willingToRelocate"
                            checked={formData.willingToRelocate}
                            onChange={(e) =>
                                setFormData(prev => ({
                                    ...prev,
                                    willingToRelocate: e.target.checked
                                }))
                            }
                        />
                        Willing to relocate
                    </label>
                </div>

                {message && (
                    <p className="form-message">{message}</p>
                )}

                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                >
                    {saving ? 'Saving...' : 'Save Preferences'}
                </button>
            </form>
        </div>
    );
}

export default PreferenceSection;