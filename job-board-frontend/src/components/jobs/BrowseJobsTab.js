import React, {useEffect, useState} from 'react';
import {fetchJobs, searchJobs, getEmployeeApplications, applyJob, getWatchList, saveJob, removeSavedJob
} from '../../api/api';

function BrowseJobsTab() {
    const [jobs, setJobs] = useState([]);
    const [appliedJobIds, setAppliedJobIds] = useState(new Set());
    const [watchListJobIds, setWatchListJobIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);

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
            alert('Failed to load jobs');
        }

        try {
            const appsRes = await getEmployeeApplications();
            const appliedIds = new Set(
                (appsRes.data || []).map(app => app.job?.id).filter(Boolean)
            );
            setAppliedJobIds(appliedIds);
        } catch (error) {
            console.error('Failed to load applications:', error);
        }

        try {
            const watchRes = await getWatchList();
            const savedIds = new Set(
                (watchRes.data || []).map(item => item.job?.id).filter(Boolean)
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
            alert('Search failed. Please try again.');
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
            alert('Failed to reload jobs');
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
        try {
            await applyJob(jobId);
            alert('Application submitted successfully');

            setAppliedJobIds(prev => new Set([...prev, jobId]));
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
            const message =
                error?.response?.data?.message || 'Could not update watchlist';
            alert(message);
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
                    🔄 Refresh
                </button>
            </div>

            <div className="search-bar">
                <form onSubmit={handleSearch} className="search-form">
                    <div className="search-inputs">
                        <div className="input-group">
                            <label htmlFor="title">🔍 Job Title</label>
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
                            <label htmlFor="location">📍 Location</label>
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
                            <label htmlFor="minSalary">💰 Min Salary</label>
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
                            {isSearching ? '⏳ Searching...' : '🔍 Search Jobs'}
                        </button>

                        {hasActiveFilters() && (
                            <button
                                type="button"
                                onClick={handleClearSearch}
                                className="btn btn-outline"
                            >
                                ✕ Clear Filters
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="job-count">
                {hasActiveFilters() && <span>🎯 Search Results: </span>}
                <strong>{jobs.length}</strong> job{jobs.length !== 1 ? 's' : ''} available
            </div>

            {jobs.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">📭</div>
                    <h3>No jobs found</h3>
                    <p>
                        {hasActiveFilters()
                            ? 'No jobs match your search criteria. Try adjusting your filters.'
                            : 'No open positions available at the moment. Check back later!'}
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
                                    <div className="job-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                        <h3>{job.title}</h3>

                                        <button
                                            className="heart-btn"
                                            onClick={() => toggleWatchList(job.id)}
                                            title={isSaved ? 'Remove from watchlist' : 'Save to watchlist'}
                                            type="button"
                                            style={{
                                                fontSize: '1.4rem',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {isSaved ? '❤️' : '🤍'}
                                        </button>
                                    </div>

                                    <div className="job-meta">
                                        <span>📍 {job.location || 'Remote'}</span>
                                        <span>💰 ${job.minSalary?.toLocaleString() || 'Negotiable'}</span>
                                        <span>🕒 {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Recently posted'}</span>
                                    </div>

                                    <p className="job-description">
                                        {job.description
                                            ? (
                                                job.description.length > 200
                                                    ? job.description.substring(0, 200) + '...'
                                                    : job.description
                                            )
                                            : 'No description provided'}
                                    </p>

                                    <div className="job-actions" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                        {alreadyApplied ? (
                                            <button className="btn btn-outline btn-sm" disabled>
                                                Applied
                                            </button>
                                        ) : (
                                            <button
                                                className="btn btn-primary btn-sm"
                                                onClick={() => handleApply(job.id)}
                                            >
                                                Apply Now →
                                            </button>
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