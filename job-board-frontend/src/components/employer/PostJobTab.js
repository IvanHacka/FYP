// import React, {useState} from 'react';
// import {createJob} from '../../api/api';
//
// const PostJobTab = () => {
//     const [newJob, setNewJob] = useState({
//         title: '',
//         description: '',
//         location: '',
//         minSalary: ''
//     });
//
//     const handlePostJob = async (e) => {
//         e.preventDefault();
//
//         try {
//             await createJob(newJob);
//             alert('Job Posted Successfully!');
//             setNewJob({
//                 title: '',
//                 description: '',
//                 location: '',
//                 minSalary: ''
//             });
//         } catch (error) {
//             console.error('Failed to post job:', error);
//             alert('Failed to post job.');
//         }
//     };
//
//     return (
//         <div className="tab-panel">
//             <h2>Post a New Job</h2>
//
//             <form onSubmit={handlePostJob} className="job-form">
//                 <input
//                     placeholder="Job Title (e.g., Senior Software Engineer)"
//                     value={newJob.title}
//                     onChange={e => setNewJob({ ...newJob, title: e.target.value })}
//                     required
//                 />
//
//                 <textarea
//                     placeholder="Job Description - Tell candidates what makes this role exciting..."
//                     value={newJob.description}
//                     onChange={e => setNewJob({ ...newJob, description: e.target.value })}
//                     required
//                     rows="6"
//                 />
//
//                 <div className="form-row">
//                     <input
//                         placeholder="Location (e.g., New York, Remote)"
//                         value={newJob.location}
//                         onChange={e => setNewJob({ ...newJob, location: e.target.value })}
//                     />
//
//                     <input
//                         type="number"
//                         placeholder="Minimum Salary ($)"
//                         value={newJob.minSalary}
//                         onChange={e => setNewJob({ ...newJob, minSalary: e.target.value })}
//                     />
//                 </div>
//
//                 <button type="submit" className="btn btn-primary">
//                     Publish Job
//                 </button>
//             </form>
//         </div>
//     );
// }
//
// export default PostJobTab;
import React, { useEffect, useState } from 'react';
import { createJob, getSkillList, addJobSkill, getJobSkills, deleteJobSkill } from '../../api/api';

const PostJobTab = () => {
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        location: '',
        minSalary: ''
    });

    const [skills, setSkills] = useState([]);
    const [createdJobId, setCreatedJobId] = useState(null);
    const [jobSkills, setJobSkills] = useState([]);
    const [skillForm, setSkillForm] = useState({
        skillId: '',
        importanceLevel: 3
    });

    useEffect(() => {
        loadSkills();
    }, []);

    const loadSkills = async () => {
        try {
            const res = await getSkillList();
            setSkills(res.data || []);
        } catch (error) {
            console.error('Failed to load skills:', error);
        }
    };

    const loadJobSkills = async (jobId) => {
        try {
            const res = await getJobSkills(jobId);
            setJobSkills(res.data || []);
        } catch (error) {
            console.error('Failed to load job skills:', error);
        }
    };

    const handlePostJob = async (e) => {
        e.preventDefault();

        try {
            const res = await createJob(newJob);
            const createdJob = res.data;

            if (!createdJob?.id) {
                alert('Job created, but no job id was returned.');
                return;
            }

            setCreatedJobId(createdJob.id);
            setJobSkills([]);
            alert('Job Posted Successfully! Now add required skills.');
        } catch (error) {
            console.error('Failed to post job:', error);
            alert('Failed to post job.');
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();

        if (!createdJobId) {
            alert('Please create the job first.');
            return;
        }

        if (!skillForm.skillId) {
            alert('Please select a skill.');
            return;
        }

        try {
            await addJobSkill(createdJobId, {
                skillId: Number(skillForm.skillId),
                importanceLevel: Number(skillForm.importanceLevel)
            });

            setSkillForm({
                skillId: '',
                importanceLevel: 3
            });

            loadJobSkills(createdJobId);
        } catch (error) {
            console.error('Failed to add job skill:', error);
            const message = error.response?.data?.message || 'Failed to add skill';
            alert(message);
        }
    };

    const handleDeleteSkill = async (jobSkillId) => {
        try {
            await deleteJobSkill(jobSkillId);
            setJobSkills(prev => prev.filter(skill => skill.id !== jobSkillId));
        } catch (error) {
            console.error('Failed to delete job skill:', error);
            alert('Failed to delete skill');
        }
    };

    const resetForm = () => {
        setNewJob({
            title: '',
            description: '',
            location: '',
            minSalary: ''
        });
        setCreatedJobId(null);
        setJobSkills([]);
        setSkillForm({
            skillId: '',
            importanceLevel: 3
        });
    };

    const importanceLabel = (level) => {
        switch (Number(level)) {
            case 1: return 'Nice to have';
            case 2: return 'Low';
            case 3: return 'Useful';
            case 4: return 'Important';
            case 5: return 'Essential';
            default: return 'Unknown';
        }
    };

    return (
        <div className="tab-panel">
            <h2>Post a New Job</h2>

            {!createdJobId ? (
                <form onSubmit={handlePostJob} className="job-form">
                    <input
                        placeholder="Job Title (e.g., Senior Software Engineer)"
                        value={newJob.title}
                        onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                        required
                    />

                    <textarea
                        placeholder="Job Description - Tell candidates what makes this role exciting..."
                        value={newJob.description}
                        onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                        required
                        rows="6"
                    />

                    <div className="form-row">
                        <input
                            placeholder="Location (e.g., New York, Remote)"
                            value={newJob.location}
                            onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                        />

                        <input
                            type="number"
                            placeholder="Minimum Salary ($)"
                            value={newJob.minSalary}
                            onChange={e => setNewJob({ ...newJob, minSalary: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        Publish Job
                    </button>
                </form>
            ) : (
                <div>
                    <div className="empty-state success" style={{ marginBottom: '20px' }}>
                        <div className="success-icon">✓</div>
                        <h3>Job created successfully</h3>
                        <p>Add required skills and importance levels below.</p>
                    </div>

                    <form onSubmit={handleAddSkill} className="job-form">
                        <div className="form-row">
                            <select
                                value={skillForm.skillId}
                                onChange={e => setSkillForm({ ...skillForm, skillId: e.target.value })}
                                required
                            >
                                <option value="">Select a skill</option>
                                {skills.map(skill => (
                                    <option key={skill.id} value={skill.id}>
                                        {skill.skillName}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={skillForm.importanceLevel}
                                onChange={e => setSkillForm({ ...skillForm, importanceLevel: e.target.value })}
                            >
                                <option value={1}>1 - Nice to have</option>
                                <option value={2}>2 - Low</option>
                                <option value={3}>3 - Useful</option>
                                <option value={4}>4 - Important</option>
                                <option value={5}>5 - Essential</option>
                            </select>
                        </div>

                        <button type="submit" className="btn btn-primary">
                            Add Required Skill
                        </button>
                    </form>

                    <div style={{ marginTop: '24px' }}>
                        <h3>Required Skills</h3>

                        {jobSkills.length === 0 ? (
                            <p style={{ color: '#7f8c8d' }}>No required skills added yet.</p>
                        ) : (
                            <ul className="application-list">
                                {jobSkills.map(item => (
                                    <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span>
                                            <strong>{item.skillName}</strong> — {importanceLabel(item.importanceLevel)}
                                        </span>
                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleDeleteSkill(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <button className="btn btn-outline" onClick={resetForm}>
                            Post Another Job
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostJobTab;