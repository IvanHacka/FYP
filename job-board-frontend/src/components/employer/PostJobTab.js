import React, {useState} from 'react';
import {createJob} from '../../api/api';

const PostJobTab = () => {
    const [newJob, setNewJob] = useState({
        title: '',
        description: '',
        location: '',
        minSalary: ''
    });

    const handlePostJob = async (e) => {
        e.preventDefault();

        try {
            await createJob(newJob);
            alert('Job Posted Successfully!');
            setNewJob({
                title: '',
                description: '',
                location: '',
                minSalary: ''
            });
        } catch (error) {
            console.error('Failed to post job:', error);
            alert('Failed to post job.');
        }
    };

    return (
        <div className="tab-panel">
            <h2>Post a New Job</h2>

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
        </div>
    );
}

export default PostJobTab;