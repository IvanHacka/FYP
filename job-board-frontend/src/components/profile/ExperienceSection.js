import React, { useState, useEffect } from 'react';
import { getExperiences, addExperience, updateExperience,
    deleteExperience } from "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/api/api.js";
import '/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/components/profile/ProfileStyle.css';

const ExperienceSection = ({ onUpdate }) => {
    const [experiences, setExperiences] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({companyName: '',
        jobTitle: '', startDate: '', endDate: '', isCurrent: false,
        description: ''
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadExperiences();
    }, []);

    const loadExperiences = async () => {
        try {
            const response = await getExperiences();
            setExperiences(response.data);
        } catch (error) {
            console.error('Error loading experiences:', error);
            alert('Failed to load experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateExperience(editingId, formData);
            } else {
                await addExperience(formData);
            }

            await loadExperiences();
            resetForm();
            onUpdate(); // Refresh profile completion
        } catch (error) {
            console.error('Error saving experience:', error);
            alert('Failed to save experience');
        }
    };

    const handleEdit = (experience) => {
        setFormData({
            companyName: experience.companyName,
            jobTitle: experience.jobTitle,
            startDate: experience.startDate,
            endDate: experience.endDate || '',
            isCurrent: experience.isCurrent,
            description: experience.description || ''
        });
        setEditingId(experience.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) {
            return;
        }

        try {
            await deleteExperience(id);
            await loadExperiences();
            onUpdate(); // Refresh profile completion
        } catch (error) {
            console.error('Error deleting experience:', error);
            alert('Failed to delete experience');
        }
    };

    const resetForm = () => {
        setFormData({
            companyName: '',
            jobTitle: '',
            startDate: '',
            endDate: '',
            isCurrent: false,
            description: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    };

    if (loading) {
        return <div className="loading">Loading experiences...</div>;
    }

    return (
        <div className="experience-section">
            <div className="section-header">
                <h2>Work Experience</h2>
                {!showForm && (
                    <button className="btn-add" onClick={() => setShowForm(true)}>
                        + Add Experience
                    </button>
                )}
            </div>

            {showForm && (
                <form className="experience-form" onSubmit={handleSubmit}>
                    <h3>{editingId ? 'Edit Experience' : 'Add Experience'}</h3>

                    <div className="form-group">
                        <label>Company Name *</label>
                        <input
                            type="text"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Job Title *</label>
                        <input
                            type="text"
                            name="jobTitle"
                            value={formData.jobTitle}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date *</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleInputChange}
                                disabled={formData.isCurrent}
                            />
                        </div>
                    </div>

                    <div className="form-group checkbox-group">
                        <label>
                            <input
                                type="checkbox"
                                name="isCurrent"
                                checked={formData.isCurrent}
                                onChange={handleInputChange}
                            />
                            I currently work here
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            rows="4"
                            placeholder="Describe your responsibilities and achievements..."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            {editingId ? 'Update' : 'Save'}
                        </button>
                        <button type="button" className="btn-cancel" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="experiences-list">
                {experiences.length === 0 ? (
                    <div className="empty-state">
                        <p>No work experience added yet.</p>
                        <p>Add your first experience to get started!</p>
                    </div>
                ) : (
                    experiences.map(exp => (
                        <div key={exp.id} className="experience-card">
                            <div className="experience-header">
                                <div>
                                    <h3>{exp.jobTitle}</h3>
                                    <h4>{exp.companyName}</h4>
                                    <p className="experience-dates">
                                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                                    </p>
                                </div>
                                <div className="experience-actions">
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleEdit(exp)}
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        className="btn-icon"
                                        onClick={() => handleDelete(exp.id)}
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                            {exp.description && (
                                <p className="experience-description">{exp.description}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExperienceSection;