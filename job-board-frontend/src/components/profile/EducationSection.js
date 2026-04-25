import React, { useEffect, useState } from 'react';
import {getEducation, addEducation, updateEducation, deleteEducation, searchInstitutions} from "../../api/api.js";
import './ProfileStyle.css';

function EducationSection({onUpdate}) {
    const [educationList, setEducationList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);

    const [institutionSuggestions, setInstitutionSuggestions] = useState([]);
    const [searchingInstitutions, setSearchingInstitutions] = useState(false);


    const [formData, setFormData] = useState({
        institution: '',
        degree: '',
        fieldOfStudy: '',
        startDate: '',
        endDate: '',
        description: ''
    });

    useEffect(() => {
        loadEducation();
    }, []);

    const loadEducation = async () => {
        try {
            const response = await getEducation();
            setEducationList(response.data || []);
        } catch (error) {
            console.error('Failed to load education:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            description: ''
        });
        setEditingId(null);
        setShowForm(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleInstitutionChange = async (e) => {
        const value = e.target.value;

        setFormData(prev => ({
            ...prev,
            institution: value
        }));

        if (value.trim().length < 2) {
            setInstitutionSuggestions([]);
            return;
        }

        try {
            setSearchingInstitutions(true);
            const response = await searchInstitutions(value);
            setInstitutionSuggestions(response.data || []);
        } catch (error) {
            console.error('Failed to search institutions:', error);
            setInstitutionSuggestions([]);
        } finally {
            setSearchingInstitutions(false);
        }
    };

    const selectInstitution = (institution) => {
        setFormData(prev => ({
            ...prev,
            institution: institution.name
        }));

        setInstitutionSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                await updateEducation(editingId, formData);
            } else {
                await addEducation(formData);
            }

            await loadEducation();
            resetForm();

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to save education:', error);
        }
    };

    const handleEdit = (education) => {
        setEditingId(education.id || education.educationId);

        setFormData({
            institution: education.institution || '',
            degree: education.degree || '',
            fieldOfStudy: education.fieldOfStudy || '',
            startDate: education.startDate || '',
            endDate: education.endDate || '',
            description: education.description || ''
        });

        setShowForm(true);
    };

    const handleDelete = async (educationId) => {
        const confirmed = window.confirm('Delete this education record?');
        if (!confirmed) return;

        try {
            await deleteEducation(educationId);
            await loadEducation();

            if (onUpdate) {
                onUpdate();
            }
        } catch (error) {
            console.error('Failed to delete education:', error);
        }
    };

    if (loading) {
        return <div className="loading">Loading education...</div>;
    }

    return (
        <div className="profile-section">
            <div className="section-header">
                <h2>Education</h2>

                <button
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    + Add Education
                </button>
            </div>

            {showForm && (
                <form className="profile-form" onSubmit={handleSubmit}>
                    <div className="form-group" style={{ position: 'relative' }}>
                        <label>Institution</label>
                        <input
                            type="text"
                            name="institution"
                            value={formData.institution}
                            onChange={handleInstitutionChange}
                            required
                            placeholder="Search or enter institution name"
                            autoComplete="off"
                        />

                        {institutionSuggestions.length > 0 && (
                            <ul className="suggestion-list">
                                {institutionSuggestions.map(institution => (
                                    <li
                                        key={institution.id}
                                        onClick={() => selectInstitution(institution)}
                                    >
                                        <strong>{institution.name}</strong>
                                        <span>{institution.country}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {searchingInstitutions && (
                            <small>Searching institutions...</small>
                        )}
                    </div>

                    <div className="form-group">
                        <label>Degree</label>
                        <input
                            type="text"
                            name="degree"
                            value={formData.degree}
                            onChange={handleChange}
                            required
                            placeholder="e.g. BSc Computer Science"
                        />
                    </div>

                    <div className="form-group">
                        <label>Field of Study</label>
                        <input
                            type="text"
                            name="fieldOfStudy"
                            value={formData.fieldOfStudy}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineering"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Relevant modules, achievements, dissertation, etc."
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary">
                            {editingId ? 'Update Education' : 'Save Education'}
                        </button>

                        <button
                            type="button"
                            className="btn btn-outline"
                            onClick={resetForm}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}


            {educationList.length === 0 ? (
                <div className="empty-state">
                    <h3>No education added yet</h3>
                    <p>Add your education history to improve your profile completion.</p>
                </div>
            ) : (
                <div className="profile-card-list">
                    {educationList.map(education => {
                        const educationId = education.id || education.educationId;

                        return (
                            <div key={educationId} className="profile-card">
                                <div className="profile-card-header">
                                    <div>
                                        <h3>{education.degree || 'Untitled Degree'}</h3>
                                        <p>{education.institution}</p>
                                    </div>

                                    <div className="card-actions">
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleEdit(education)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(educationId)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>

                                {education.fieldOfStudy && (
                                    <p><strong>Field:</strong> {education.fieldOfStudy}</p>
                                )}

                                {(education.startDate || education.endDate) && (
                                    <p>
                                        <strong>Period:</strong>{' '}
                                        {education.startDate || 'Unknown'} - {education.endDate || 'Present'}
                                    </p>
                                )}

                                {education.description && (
                                    <p>{education.description}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default EducationSection;