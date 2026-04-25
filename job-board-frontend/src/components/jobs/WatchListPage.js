import React, { useEffect, useState } from 'react';
import {getWatchList, removeSavedJob, getEmployeeApplications, applyJob, saveJob} from '../../api/api';

function WatchListPage() {
    const [watchList, setWatchList] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            const watchRes = await getWatchList();
            const appsRes = await getEmployeeApplications();

            setWatchList(watchRes.data || []);

            const appliedIds = new Set(
                (appsRes.data || []).map(app => app.jobId).filter(Boolean)
            );
            setAppliedJobIds(appliedIds);
        } catch (error) {
            console.error('Failed to load watchlist page data', error);
        } finally {
            setLoading(false);
        }
    };


    const handleRemove = async (jobId) => {
        if (!window.confirm('Remove this job from your watchlist?')) {
            return;
        }

        try {
            await removeSavedJob(jobId);
            setWatchList(prev => prev.filter(job => job.jobId !== jobId));
        } catch (error) {
            console.error('Failed to remove from watchlist', error);
        }
    };

    const handleApply = async (jobId) => {
        try {
            await applyJob(jobId);
            setAppliedJobIds(prev => new Set([...prev, jobId]));
        } catch (error) {
            console.error('Application failed:', error);
        }
    };

    if (loading) {
        return (
            <div className="tab-panel">
                <h2>Saved Jobs</h2>
                <div className="loading">Loading watchlist...</div>
            </div>
        );
    }

    return (
        <div className="tab-panel">
            <div className="section-header">
                <h2>Saved Jobs</h2>
                <button className="btn btn-outline" onClick={loadData}>
                    ↻ Refresh ↻
                </button>
            </div>

            <div className="job-count">
                <strong>{watchList.length}</strong> saved job{watchList.length !== 1 ? 's' : ''}
            </div>

            {watchList.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">♡</div>
                    <h3>No saved jobs yet</h3>
                    <p>Jobs you save will appear here.</p>
                </div>
            ) : (
                <ul className="job-list">
                    {watchList.map(job => {
                        const alreadyApplied = appliedJobIds.has(job.jobId);
                        const isSaved = true;

                        return (
                            <li key={job.id} className="job-card">
                                <div className="job-card-content">
                                    <div
                                        className="job-header"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            gap: '12px'
                                        }}
                                    >
                                        <h3>{job.title}</h3>

                                        <button
                                            className={"heart-btn saved"}
                                            onClick={() => handleRemove(job.jobId)}
                                            title="Remove from watchList"
                                            type="button"
                                        >
                                            -`♡´-
                                        </button>
                                    </div>

                                    <div className="job-meta">
                                        <span>✈︎ {job.location || 'Remote'} ✈︎</span>
                                        <span>£ {job.minSalary?.toLocaleString() || 'Negotiable'} £</span>
                                        <span>◴ {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'} ◴</span>
                                    </div>

                                    <p className="job-description">
                                        {job.description
                                            ? (
                                                job.description.length > 200 ?
                                                    job.description.substring(0, 200) + '...' :
                                                    job.description
                                            )
                                            : 'No description provided'}
                                    </p>
                                    <div className="job-match-score">
                                        {job.matchScore != null ?
                                            `Match Score: ${job.matchScore}%` :
                                            'Match score unavailable'}
                                    </div>

                                    {job.jobSkills && job.jobSkills.length > 0 && (
                                        <div className="job-skills-preview">
                                            <div className="job-skills-label">Required Skills</div>
                                            <div className="job-skills-tags">
                                                {job.jobSkills.map(skill => (
                                                    <span key={skill.id} className="job-skill-tag">
                                                        {skill.skillName}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div
                                        className="job-actions"
                                        style={{display: 'flex', gap: '10px', alignItems: 'center'}}
                                    >
                                        {alreadyApplied ? (
                                            <button className="btn btn-outline btn-sm" disabled>
                                                Applied
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleApply(job.jobId)}
                                            >
                                                Apply Now 𓂃✍︎
                                            </button>
                                        )}

                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => handleRemove(job.jobId)}
                                            type="button"
                                        >
                                            Remove from Watchlist
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default WatchListPage;