import React, { useState, useEffect } from 'react';
import { getSkills, addSkill, updateSkillProficiency, deleteSkill,
    getSkillList } from "/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/api/api.js";
import '/Users/haymac/Desktop/FYP/redo/JobBoard/job-board-frontend/src/components/profile/ProfileStyle.css';

const SkillsSection = ({ onUpdate }) => {
    const [skills, setSkills] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedSkillId, setSelectedSkillId] = useState('');
    const [proficiencyLevel, setProficiencyLevel] = useState(3);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSkills();
        loadAvailableSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const response = await getSkills();
            setSkills(response.data);
        } catch (error) {
            console.error('Error loading skills:', error);
            alert('Failed to load skills');
        } finally {
            setLoading(false);
        }
    };

    const loadAvailableSkills = async () => {
        try {
            const response = await getSkillList();
            setAvailableSkills(response.data);
        } catch (error) {
            console.error('Error loading available skills:', error);
            // If endpoint doesn't exist, use hardcoded list
            setAvailableSkills([
                { id: 1, skillName: 'Java' },
                { id: 2, skillName: 'Spring Boot' },
                { id: 3, skillName: 'React' },
                { id: 4, skillName: 'JavaScript' },
                { id: 5, skillName: 'Python' },
                { id: 6, skillName: 'SQL' },
                { id: 7, skillName: 'Docker' },
                { id: 8, skillName: 'AWS' },
            ]);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();

        if (!selectedSkillId) {
            alert('Please select a skill');
            return;
        }

        try {
            await addSkill({
                skillId: parseInt(selectedSkillId),
                proficiencyLevel: proficiencyLevel
            });
            await loadSkills();
            resetForm();
            onUpdate(); // Refresh profile completion
        } catch (error) {
            console.error('Error adding skill:', error);
            alert(error.response?.data || 'Failed to add skill');
        }
    };

    const handleUpdateProficiency = async (skillId, newLevel) => {
        try {
            await updateSkillProficiency(skillId, newLevel);
            await loadSkills();
            onUpdate(); // Refresh profile completion
        } catch (error) {
            console.error('Error updating skill:', error);
            alert('Failed to update skill proficiency');
        }
    };

    const handleRemoveSkill = async (skillId) => {
        if (!window.confirm('Are you sure you want to remove this skill?')) {
            return;
        }

        try {
            await deleteSkill(skillId);
            await loadSkills();
            onUpdate(); // Refresh profile completion
        } catch (error) {
            console.error('Error removing skill:', error);
            alert('Failed to remove skill');
        }
    };

    const resetForm = () => {
        setSelectedSkillId('');
        setProficiencyLevel(3);
        setShowForm(false);
    };

    const getProficiencyLabel = (level) => {
        const labels = {
            1: 'Beginner',
            2: 'Intermediate',
            3: 'Advanced',
            4: 'Expert',
            5: 'Master'
        };
        return labels[level] || 'Unknown';
    };

    const getProficiencyColor = (level) => {
        const colors = {
            1: '#e74c3c',
            2: '#e67e22',
            3: '#f39c12',
            4: '#2ecc71',
            5: '#27ae60'
        };
        return colors[level] || '#95a5a6';
    };

    const getAvailableSkillsForDropdown = () => {
        const userSkillIds = skills
            .filter(s => s && s.skill && s.skill.id)
            .map(s => s.skill.id);
        return availableSkills.filter(skill => !userSkillIds.includes(skill.id));
    };

    if (loading) {
        return <div className="loading">Loading skills...</div>;
    }

    return (
        <div className="skills-section">
            <div className="section-header">
                <h2>Skills</h2>
                {!showForm && (
                    <button className="btn-add" onClick={() => setShowForm(true)}>
                        + Add Skill
                    </button>
                )}
            </div>

            {showForm && (
                <form className="skill-form" onSubmit={handleAddSkill}>
                    <h3>Add Skill</h3>

                    <div className="form-group">
                        <label>Select Skill *</label>
                        <select
                            value={selectedSkillId}
                            onChange={(e) => setSelectedSkillId(e.target.value)}
                            required
                        >
                            <option value="">-- Select a skill --</option>
                            {getAvailableSkillsForDropdown().map(skill => (
                                <option key={skill.id} value={skill.id}>
                                    {skill.skillName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>
                            Proficiency Level: {getProficiencyLabel(proficiencyLevel)}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={proficiencyLevel}
                            onChange={(e) => setProficiencyLevel(parseInt(e.target.value))}
                            className="proficiency-slider"
                        />
                        <div className="proficiency-labels">
                            <span>Beginner</span>
                            <span>Master</span>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-save">
                            Add Skill
                        </button>
                        <button type="button" className="btn-cancel" onClick={resetForm}>
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <div className="skills-grid">
                {skills.length === 0 ? (
                    <div className="empty-state">
                        <p>No skills added yet.</p>
                        <p>Add your skills to showcase your expertise!</p>
                    </div>
                ) : (
                    skills.map(userSkill => (
                        <div key={userSkill.id} className="skill-card">
                            <div className="skill-header">
                                <h3>{userSkill.skill.skillName}</h3>
                                <button
                                    className="btn-remove"
                                    onClick={() => handleRemoveSkill(userSkill.skill.id)}
                                    title="Remove skill"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="skill-proficiency">
                                <label>Proficiency</label>
                                <select
                                    value={userSkill.proficiencyLevel}
                                    onChange={(e) => handleUpdateProficiency(
                                        userSkill.skill.id,
                                        parseInt(e.target.value)
                                    )}
                                    style={{
                                        backgroundColor: getProficiencyColor(userSkill.proficiencyLevel),
                                        color: 'white'
                                    }}
                                >
                                    <option value="1">1 - Beginner</option>
                                    <option value="2">2 - Intermediate</option>
                                    <option value="3">3 - Advanced</option>
                                    <option value="4">4 - Expert</option>
                                    <option value="5">5 - Master</option>
                                </select>
                            </div>

                            <div className="proficiency-bar">
                                <div
                                    className="proficiency-fill"
                                    style={{
                                        width: `${(userSkill.proficiencyLevel / 5) * 100}%`,
                                        backgroundColor: getProficiencyColor(userSkill.proficiencyLevel)
                                    }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>

            {skills.length > 0 && (
                <div className="skills-summary">
                    <p>You have <strong>{skills.length}</strong> skill{skills.length !== 1 ? 's' : ''} listed</p>
                </div>
            )}
        </div>
    );
};

export default SkillsSection;