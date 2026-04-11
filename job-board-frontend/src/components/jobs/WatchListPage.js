import React, {useEffect, useState} from 'react';
import {getWatchList, removeSavedJob} from '../../api/api';

function WatchListPage() {
    const [watchList, setWatchList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWatchList();
    }, []);

    const loadWatchList = async () => {
        try {
            const res = await getWatchList();
            setWatchList(res.data || []);
        } catch (error) {
            console.error('Failed to load watchlist', error);
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
            setWatchList(prev => prev.filter(item => item.jobId !== jobId));
        } catch (error) {
            console.error('Failed to remove from watchlist', error);
            alert('Could not remove saved job');
        }
    };

    if (loading) {
        return (
            <div className="watchlist-page">
                <h2>Saved Jobs</h2>
                <div className="loading">Loading watchlist...</div>
            </div>
        );
    }

    return (
        <div className="watchlist-page">
            <h2>Saved Jobs</h2>
            <button onClick={loadWatchList} className="btn-refresh">
                🔄 Refresh
            </button>

            {watchList.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-icon">-`♡´-</div>
                    <p>No saved jobs yet.</p>

                </div>
            ) : (
                watchList.map(item => (
                    <div key={item.id} className="job-card">
                        <h3>{item.title}</h3>
                        <p>{item.location}</p>
                        <p>{item.description}</p>
                        <p>{item.minSalary}</p>
                        <button onClick={() => handleRemove(item.jobId)}>
                            Remove
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}

export default WatchListPage;