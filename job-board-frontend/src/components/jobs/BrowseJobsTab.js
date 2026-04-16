import React, {useEffect, useState} from 'react';
import {fetchJobs, searchJobs, getEmployeeApplications, applyJob, getWatchList,
    saveJob, removeSavedJob, getMatchScoreBreakdown
} from '../../api/api';

function BrowseJobsTab() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [watchListJobIds, setWatchListJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

    // Breakdowns
    const [scoreDetailsByJob, setScoreDetailsByJob] = useState({});
    const [openScoreJobId, setOpenScoreJobId] = useState(null);

    // Preferences
    const [applyFormByJob, setApplyFormByJob] = useState({});
    const [showApplyFormJobId, setShowApplyFormJobId] = useState(null);

    const [searchFilters, setSearchFilters] = useState({
        title: '',
        location: '',
        minSalary: ''
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);

        try {
            const jobsRes = await fetchJobs();
            setJobs(jobsRes.data || []);
        } catch (error) {
            console.error('Failed to load jobs:', error);
        }

        try {
            const appsRes = await getEmployeeApplications();
            const appliedIds = new Set(
                (appsRes.data || []).map(app => app.jobId).filter(Boolean)
            );
            setAppliedJobIds(appliedIds);
        } catch (error) {
            console.error('Failed to load applications:', error);
        }

        try {
            const watchRes = await getWatchList();
            const savedIds = new Set(
                (watchRes.data || []).map(job => job.jobId).filter(Boolean)
            );
            setWatchListJobIds(savedIds);
        } catch (error) {
            console.error('Failed to load watchlist:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchInputChange = (e) => {
        const {name, value} = e.target;
        setSearchFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsSearching(true);

        try {
            const response = await searchJobs(searchFilters);
            setJobs(response.data || []);
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = async () => {
        setSearchFilters({
            title: '',
            location: '',
            minSalary: ''
        });

        try {
            const response = await fetchJobs();
            setJobs(response.data || []);
        } catch (error) {
            console.error('Failed to reload jobs:', error);
        }
    };

    const hasActiveFilters = () => {
        return (
            searchFilters.title.trim() !== '' ||
            searchFilters.location.trim() !== '' ||
            (searchFilters.minSalary && Number(searchFilters.minSalary) > 0)
        );
    };

    const handleApply = async (jobId) => {
        const form = applyFormByJob[jobId] || {};
        const whyGoodFit = (form.whyGoodFit || '').trim();
        const expectedSalary = form.expectedSalary;
        const availableStartDate = form.availableStartDate;

        if (!whyGoodFit) {
            alert('Please enter why you are a good fit');
            return;
        }

        if (expectedSalary && Number(expectedSalary) <= 0) {
            alert('Expected salary must be greater than 0');
            return;
        }

        if (!availableStartDate) {
            alert('Please enter your available start date');
            return;
        }

        try {
            await applyJob(
                jobId,
                whyGoodFit,
                expectedSalary ? Number(expectedSalary) : null,
                availableStartDate
            );

            alert('Application submitted successfully');
            setAppliedJobIds(prev => new Set([...prev, jobId]));
            setShowApplyFormJobId(null);
        } catch (error) {
            console.error('Application failed:', error);
            const message =
                error?.response?.data?.message || 'You may have already applied to this job.';
            alert(message);
        }
    };

    const toggleWatchList = async (jobId) => {
        try {
            if (watchListJobIds.has(jobId)) {
                await removeSavedJob(jobId);

                setWatchListJobIds(prev => {
                    const updated = new Set(prev);
                    updated.delete(jobId);
                    return updated;
                });
            } else {
                await saveJob(jobId);

                setWatchListJobIds(prev => new Set([...prev, jobId]));
            }
        } catch (error) {
            console.error('Failed to update watchlist:', error);
            console.error(error?.response?.data?.message || 'Could not update watchlist');
        }
    };

    // preferences for each job
    const handleToggleApplyForm = (jobId) => {
        setShowApplyFormJobId(prev => (prev === jobId ? null : jobId));
    };

    const handleToggleScoreDetails = async (jobId) => {
        if (openScoreJobId === jobId) {
            setOpenScoreJobId(null);
            return;
        }

        try {
            if (!scoreDetailsByJob[jobId]) {
                const res = await getMatchScoreBreakdown(jobId);
                setScoreDetailsByJob(prev => ({
                    ...prev,
                    [jobId]: res.data
                }));
            }
            setOpenScoreJobId(jobId);
        } catch (error) {
            console.error('Failed to load match breakdown:', error);
        }
    };

    if (loading) {
        return (
            <div className="tab-panel">
                <h2>Available Positions</h2>
                <div className="loading">Loading jobs...</div>
            </div>
        );
    }

    return (
        <div className="tab-panel">
            <div className="section-header">
                <h2>Available Positions</h2>
                <button className="btn btn-outline" onClick={loadData}>
                    ↻ Refresh ↻
                </button>
            </div>

            <div className="search-bar">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-inputs">
                        <div className="input-group">
                            <label htmlFor="title">⌕ Job Title ⌕</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={searchFilters.title}
                                onChange={handleSearchInputChange}
                                placeholder="e.g., Software Engineer..."
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="location">✈︎ Location ✈︎</label>
                            <input
                                type="text"
                                id="location"
                                name="location"
                                value={searchFilters.location}
                                onChange={handleSearchInputChange}
                                placeholder="e.g., New York, Remote..."
                            />
                        </div>

                        <div className="input-group">
                            <label htmlFor="minSalary">$ Min Salary $</label>
                            <input
                                type="number"
                                id="minSalary"
                                name="minSalary"
                                value={searchFilters.minSalary}
                                onChange={handleSearchInputChange}
                                placeholder="e.g., 50000"
                            />
                        </div>
                    </div>

                    <div className="search-buttons">
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isSearching}
                        >
                            {isSearching ? 'ೱ Searching...' : '⌕ Search Jobs'}
                        </button>

                        {hasActiveFilters() && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="btn btn-outline"
                            >
                                ⛌ Clear Filters ⛌
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="job-count">
                {hasActiveFilters() && <span> Search Results: </span>}
                <strong>{jobs.length}</strong> job{jobs.length !== 1 ? 's' : ''} available
            </div>

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">✉︎</div>
                    <h3>No jobs found</h3>
                    <p>
                        {hasActiveFilters() ? 'No jobs match your search criteria.' :
                            'No open positions available at the moment. Check later!'}
                    </p>
                </div>
            ) : (
                <ul className="job-list">
                    {jobs.map(job => {
                        const alreadyApplied = appliedJobIds.has(job.id);
                        const isSaved = watchListJobIds.has(job.id);

                        return (
                            <li key={job.id} className="job-card">
                                <div className="job-card-content">
                                    <div className="job-header" style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        gap: '12px'
                                    }}>
                                        <h3>{job.title}</h3>

                                        <button
                                            className={`heart-btn ${isSaved ? 'saved' : ''}`}
                                            onClick={() => toggleWatchList(job.id)}
                                            title={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
                                            type="button"
                                        >
                                            {isSaved ? '-`♡´-' : '♡'}
                                        </button>
                                    </div>

                                    <div className="job-meta">
                                        <span>✈︎ {job.location || 'Remote'} ✈︎</span>
                                        <span>$ {job.minSalary?.toLocaleString() || 'Negotiable'} $</span>
                                        <span>◴ {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'} ◴</span>
                                        <span>ⴵ Expires: {job.expiresAt ? new Date(job.expiresAt).toLocaleDateString() : 'No expiry'} ⴵ</span>
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
                                    {job.companyName && (
                                        <div style={{ color: '#555', fontSize: '0.9rem', marginBottom: '6px' }}>
                                            Hiring: {job.companyName}
                                        </div>
                                    )}
                                    {job.companyWebsite && (
                                        <a
                                            href={job.companyWebsite}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-outline btn-sm"
                                        >
                                            Company Website
                                        </a>
                                    )}
                                    <div className="job-match-score">
                                        {job.matchScore != null ?
                                            `${job.matchScore}%` :
                                            'Match score unavailable'}
                                    </div>

                                    <button
                                        className="btn btn-outline btn-sm"
                                        type="button"
                                        onClick={() => handleToggleScoreDetails(job.id)}
                                    >
                                        {openScoreJobId === job.id ? 'Hide Match Details' : 'Why this score?'}
                                    </button>

                                    {openScoreJobId === job.id && scoreDetailsByJob[job.id] && (
                                        <div className="detail-box">
                                            <h4>Match Breakdown</h4>
                                            <p>Skills: {scoreDetailsByJob[job.id].skillScore}%</p>
                                            <p>Title: {scoreDetailsByJob[job.id].titleScore}%</p>
                                            <p>Location: {scoreDetailsByJob[job.id].locationScore}%</p>
                                            <p>Salary: {scoreDetailsByJob[job.id].salaryScore}%</p>
                                            <p>Job Type: {scoreDetailsByJob[job.id].jobTypeScore}%</p>
                                        </div>
                                    )}

                                    <div className="job-actions"
                                         style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                                        {alreadyApplied ? (
                                            <button className="btn btn-outline btn-sm" disabled>
                                                Applied
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleToggleApplyForm(job.id)}
                                            >
                                                {showApplyFormJobId === job.id ? 'Cancel' : 'Apply Now 𓂃✍︎'}
                                            </button>
                                        )}
                                        {showApplyFormJobId === job.id && !alreadyApplied && (
                                            <div className="detail-box" style={{ marginTop: '12px' }}>
                                                <h4>Application</h4>

                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label>Why are you a good fit for this job?</label>
                                                    <textarea
                                                        className="form-control"
                                                        rows="4"
                                                        value={applyFormByJob[job.id]?.whyGoodFit || ''}
                                                        onChange={(e) =>
                                                            setApplyFormByJob(prev => ({
                                                                ...prev,
                                                                [job.id]: {
                                                                    ...prev[job.id],
                                                                    whyGoodFit: e.target.value
                                                                }
                                                            }))
                                                        }
                                                        placeholder="Explain why your skills and experience fit this role"
                                                    />
                                                </div>

                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label>Expected Salary</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={applyFormByJob[job.id]?.expectedSalary || ''}
                                                        onChange={(e) =>
                                                            setApplyFormByJob(prev => ({
                                                                ...prev,
                                                                [job.id]: {
                                                                    ...prev[job.id],
                                                                    expectedSalary: e.target.value
                                                                }
                                                            }))
                                                        }
                                                        placeholder="Enter your expected salary"
                                                    />
                                                </div>

                                                <div className="form-group" style={{ marginBottom: '10px' }}>
                                                    <label>Available Start Date</label>
                                                    <input
                                                        type="date"
                                                        className="form-control"
                                                        value={applyFormByJob[job.id]?.availableStartDate || ''}
                                                        onChange={(e) =>
                                                            setApplyFormByJob(prev => ({
                                                                ...prev,
                                                                [job.id]: {
                                                                    ...prev[job.id],
                                                                    availableStartDate: e.target.value
                                                                }
                                                            }))
                                                        }
                                                    />
                                                </div>

                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => handleApply(job.id)}
                                                >
                                                    Submit Application
                                                </button>
                                            </div>
                                        )}

                                        <button
                                            className="btn btn-outline btn-sm"
                                            onClick={() => toggleWatchList(job.id)}
                                            type="button"
                                        >
                                            {isSaved ? 'Remove from Watchlist' : 'Save Job'}
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

export default BrowseJobsTab;