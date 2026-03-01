// import React, {useEffect, useState} from 'react';
// import {fetchJobs, applyJob, uploadCv, createJob, fetchApplications, getCvDownloadUrl, fetchPendingEmployers, approveEmployers, getMyJobs, getMyApplication} from "./api/api";
//
// function Dashboard({role, userId, token}){
//     const [newJob, setNewJob] = useState({title: '', description: '', location: '', minSalary: 0});
//     const [jobs, setJobs] = useState([]);
//     const [selectedJobId, setSelectedJobId] = useState(null);
//     const [selectedFile, setSelectedFile] = useState(null);
//     const [allApplications, setAllApplications] = useState([]);
//     const [applications, setApplications] = useState([]);
//     const [myJobs, setMyJobs] = useState([]);
//     const [pendingEmployers, setPendingEmployers] = useState([]);
//
//     useEffect(() => {
//         if(role === 'EMPLOYER'){
//             loadMyJobs();
//         }
//         else if(role === 'ADMIN'){
//             loadPendingEmployers();
//         }
//         else{
//             getJobs();
//         }
//     }, [role, token]);
//
//     const getJobs = async () => {
//         try {
//             // handle token
//             const response = await fetchJobs();
//             setJobs(response.data);
//         } catch (error) {
//             alert('Oops! No job found. Are you logged in?');
//         }
//     };
//
//     // Load the list of pending employers
//     const loadPendingEmployers = async () => {
//         try {
//             const response = await fetchPendingEmployers();
//             setPendingEmployers(response.data);
//         } catch (error) {
//             console.error("Failed to fetch pending users", error);
//         }
//     };
//
//     const loadMyJobs = async () => {
//         try{
//             console.log("Loading Dashboard Data...");
//
//             const jobsRes = await getMyJobs();
//             setMyJobs(jobsRes.data);
//             const applicationsRes = await getMyApplication();
//             setAllApplications(applicationsRes.data);
//         }
//         catch (error){
//             console.error("Failed to load jobs dashboard");
//         }
//     };
//
//     // Handle
//
//     const handlePostJob = async (e) => {
//         e.preventDefault();
//         try {
//             await createJob(newJob);
//             alert("Job Posted Successfully!");
//             setNewJob({ title: '', description: '', location: '', minSalary: 0}); // Reset form
//             getJobs(); // Refresh immediate
//             loadMyJobs();
//         } catch (error) {
//             alert("Failed to post job.");
//         }
//     };
//
//     const handleViewApplicants = async (jobId) => {
//         // Click again it minimized
//         // if(selectedJobId === jobId){
//         //     setSelectedJobId(null);
//         //     return;
//         // }
//         try {
//             const response = await fetchApplications(jobId);
//             setApplications(response.data);
//             setSelectedJobId(jobId);
//             alert(`Found ${response.data.length} applicants!`);
//         } catch (error) {
//             alert("Could not load applicants");
//         }
//     };
//
//     // Candidate
//
//     const handleApply = async (jobId) => {
//         if (!userId) {
//             return alert("Please login.");
//         }
//         try {
//             await applyJob(jobId, userId);
//             alert("Application Successful!");
//         } catch (error) {
//             console.error(error);
//             // check error
//             const message = error.response?.data?.message || 'Application Failed';
//             alert(message);
//         }
//     };
//
//     const handleFileChange = (e) => {
//         setSelectedFile(e.target.files[0]);
//     };
//
//     const handleUpload = async () => {
//         if (!selectedFile) return alert("Please select a file!");
//         if (!userId) return alert("Please login.");
//
//         try {
//             await uploadCv(userId, selectedFile);
//             alert("CV Uploaded!");
//         } catch (error) {
//             console.error(error);
//             alert("Upload Failed: " + (error.response?.data?.message || error.message));
//         }
//     };
//
//     // ADMIN
//     const handleApprove = async (userId) => {
//         if(!window.confirm("Are you sure you want to approve this employer?")) return;
//
//         try {
//             console.log("Attempting to approve user ID:", userId);
//             await approveEmployers(userId);
//             alert("User Approved!");
//             loadPendingEmployers(); // Refresh the list
//         } catch (error) {
//             console.log(error)
//             alert("Failed to approve.");
//         }
//     };
//
//     return(
//         <div className="container">
//
//             {role === 'ADMIN' && (
//                 <div className="dashboard-panel">
//                     <h2>Admin Dashboard</h2>
//                     <p>Pending Employer Approvals:</p>
//                     {pendingEmployers.length === 0 ? <p><i>No pending approvals.</i></p> : (
//                         <table>
//                             <thead>
//                             <tr>
//                                 <th>Email</th>
//                                 <th>Date</th>
//                                 <th>Action</th>
//                             </tr>
//                             </thead>
//                             <tbody>
//                             {/*loop 'pendingEmployers' array and creat a list for each*/}
//                             {pendingEmployers.map(user => (
//                                 <tr key={user.id}>
//                                     <td>{user.email}</td>
//                                     <td>{new Date(user.createdAt).toLocaleDateString()}</td>
//                                     <td>
//                                         <button onClick={() => handleApprove(user.id)} className="btn btn-primary" style={{backgroundColor: '#10b981'}}>Approve</button>
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     )}
//                 </div>
//             )}
//
//             {role === 'EMPLOYER' && (
//                 <>
//                     <div className="summary-box">
//                         <h3> Recent Applications (Total: {allApplications.length})</h3>
//                         {allApplications.length === 0 ? <p>No applications yet.</p> : (
//                             <ul>
//                                 {allApplications.map(app => (
//                                     <li key={app.id}>
//                                         <strong>{app.applicant?.fullName || 'Candidate'}</strong> applied for <strong>{app.job?.title}</strong>
//                                         <span style={{ fontSize: '0.85em', color: '#666', marginLeft: '10px' }}>
//                                             ({new Date(app.createdAt || Date.now()).toLocaleDateString()})
//                                         </span>
//                                     </li>
//                                 ))}
//                             </ul>
//                         )}
//                     </div>
//
//                     {/* Post Job Form */}
//                     <div className="dashboard-panel">
//                         <h3>📢 Post a New Opportunity</h3>
//                         <form onSubmit={handlePostJob}>
//                             <input placeholder="Job Title" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required />
//                             <textarea placeholder="Job Description" value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required rows="3" />
//                             <div>
//                                 <input placeholder="Location" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />
//                                 <input type="number" placeholder="Min Salary" value={newJob.minSalary} onChange={e => setNewJob({...newJob, minSalary: Number(e.target.value)})} />
//                             </div>
//                             <button type="submit" className="btn btn-primary" style={{ width: 'auto', justifySelf: 'start' }}>Publish Job</button>
//                         </form>
//                     </div>
//                 </>
//             )}
//
//
//             <div>
//                 <h2>{role === 'EMPLOYER' ? 'Your Job Posts' : 'Open Positions'}</h2>
//                 <button className="btn btn-outline" onClick={role === 'EMPLOYER' ? loadMyJobs : getJobs}>Refresh List</button>
//             </div>
//
//             <ul className="job-list">
//                 {(role === 'EMPLOYER' ? myJobs : jobs).map(job => (
//                     <li key={job.id} className="job-card">
//                         <div>
//                             <div>
//                                 <h3>{job.title}</h3>
//                                 <div className="job-meta">
//                                     {job.location || 'Remote'} • ${job.minSalary} • <span className="badge">{job.status || 'OPEN'}</span>
//                                 </div>
//                                 <p>{job.description}</p>
//                             </div>
//
//                             <div>
//                                 {role === 'EMPLOYER' ? (
//                                     <button className="btn btn-primary btn-sm" onClick={() => handleViewApplicants(job.id)}>
//                                         {selectedJobId === job.id ? 'Hide Applicants' : 'View Applicants'}
//                                     </button>
//                                 ) : role === 'EMPLOYEE' ? (
//                                     <button className="btn btn-primary btn-sm" onClick={() => handleApply(job.id)}>Apply Now</button>
//                                 ) : null}
//                             </div>
//                         </div>
//
//                         {role === 'EMPLOYER' && selectedJobId === job.id && (
//                             <div className="detail-box">
//                                 <h4>Applicants for {job.title}:</h4>
//                                 {applications.length === 0 ? <p>No applicants yet.</p> : (
//                                     <ul>
//                                         {applications.map(app => (
//                                             <li key={app.id}>
//                                                 <div><strong>Name:</strong> {app.applicant?.fullName || 'Unknown'}</div>
//                                                 <div><strong>Email:</strong> {app.applicant?.email}</div>
//                                                 <div style={{ marginTop: '5px' }}>
//                                                     {app.applicant?.cv ? (
//                                                         <a href={getCvDownloadUrl(app.applicant.cv)} target="_blank" rel="noreferrer">
//                                                             Download CV
//                                                         </a>
//                                                     ) : <span style={{color: 'red'}}>No CV Uploaded</span>}
//                                                 </div>
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 )}
//                             </div>
//                         )}
//                     </li>
//                 ))}
//             </ul>
//
//             {/*Profile*/}
//             {role === 'EMPLOYEE' && (
//                 <div className="dashboard-panel" >
//                     <h3>Candidate Profile</h3>
//                     <p>Upload your CV to be visible to employers.</p>
//                     <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
//                         <input type="file" onChange={handleFileChange} style={{ width: 'auto', marginBottom: 0 }} />
//                         <button onClick={handleUpload} className="btn btn-primary btn-sm">Upload CV</button>
//                     </div>
//                 </div>
//             )}
//
//         </div>
//     );
// }
//
// export default Dashboard;
import React, {useEffect, useState} from 'react';
import {fetchJobs, searchJobs, applyJob, uploadCv, createJob, fetchApplications, getCvDownloadUrl,
    fetchPendingEmployers, approveEmployers, getMyJobs, getMyApplication
} from "./api/api";

function Dashboard({role, userId, token}){
    // Job form state (for employers)
    // '' to see placeholder
    const [newJob, setNewJob] = useState({title: '', description: '', location: '', minSalary: ''});

    // Jobs and applications state
    // update state to show on react
    const [jobs, setJobs] = useState([]);
    const [myJobs, setMyJobs] = useState([]);
    const [allApplications, setAllApplications] = useState([]);
    const [applications, setApplications] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState(null);

    // Search state for filers
    const [searchFilters, setSearchFilters] = useState({
        title: '',
        location: '',
        minSalary: ''
    });
    const [isSearching, setIsSearching] = useState(false);

    // CV upload state
    const [selectedFile, setSelectedFile] = useState(null);

    //  For admin
    const [pendingEmployers, setPendingEmployers] = useState([]);

    // Load data on mount based on role
    useEffect(() => {
        if(role === 'EMPLOYER'){
            loadMyJobs();
        }
        else if(role === 'ADMIN'){
            loadPendingEmployers();
        }
        else{
            getJobsList();
        }
    }, [role, token]);

    // Data loading
    const getJobsList = async () => {
        try {
            const response = await fetchJobs();
            setJobs(response.data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            alert('Failed to load jobs. Please try again.');
        }
    };

    const loadMyJobs = async () => {
        try{
            const jobsRes = await getMyJobs();
            setMyJobs(jobsRes.data);
            const applicationsRes = await getMyApplication();
            setAllApplications(applicationsRes.data);
        }
        catch (error){
            console.error("Failed to load employer dashboard:", error);
        }
    };

    const loadPendingEmployers = async () => {
        try {
            const response = await fetchPendingEmployers();
            setPendingEmployers(response.data);
        } catch (error) {
            console.error("Failed to fetch pending employers:", error);
        }
    };

    // Search
    const handleSearchInputChange = (e) => {
        const { name, value } = e.target;
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
            setJobs(response.data);
        } catch (error) {
            console.error('Search failed:', error);
            alert('Search failed. Please try again.');
        } finally {
            setIsSearching(false);
        }
    };

    const handleClearSearch = () => {
        setSearchFilters({
            title: '',
            location: '',
            minSalary: ''
        });
        getJobsList(); // Reload all jobs
    };

    const hasActiveFilters = () => {
        return searchFilters.title.trim() !== '' ||
            searchFilters.location.trim() !== '' ||
            (searchFilters.minSalary && searchFilters.minSalary > 0);
    };


    // employer
    const handlePostJob = async (e) => {
        e.preventDefault();
        try {
            await createJob(newJob);
            alert("Job Posted Successfully!");
            setNewJob({ title: '', description: '', location: '', minSalary: ''});
            loadMyJobs();
        } catch (error) {
            console.error('Failed to post job:', error);
            alert("Failed to post job.");
        }
    };

    const handleViewApplicants = async (jobId) => {
        if(selectedJobId === jobId){
            setSelectedJobId(null);
            return;
        }

        try {
            const response = await fetchApplications(jobId);
            setApplications(response.data);
            setSelectedJobId(jobId);
        } catch (error) {
            console.error('Failed to load applicants:', error);
            alert("Could not load applicants");
        }
    };

    // Employee
    const handleApply = async (jobId) => {
        if (!userId) {
            return alert("Please login.");
        }
        try {
            await applyJob(jobId, userId);
            alert("Application Successful!");
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || 'Application Failed';
            alert(message);
        }
    };

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert("Please select a file!");
        if (!userId) return alert("Please login.");

        try {
            await uploadCv(userId, selectedFile);
            alert("CV Uploaded!");
            setSelectedFile(null);
        } catch (error) {
            console.error(error);
            alert("Upload Failed: " + (error.response?.data?.message || error.message));
        }
    };


    // Admin
    const handleApprove = async (userId) => {
        if(!window.confirm("Are you sure you want to approve this employer?")) return;

        try {
            await approveEmployers(userId);
            alert("Employer Approved!");
            loadPendingEmployers();
        } catch (error) {
            console.error('Failed to approve employer:', error);
            alert("Failed to approve.");
        }
    };


    // react
    return(
        <div className="container" style={{paddingTop: '20px'}}>

            {/*ADMIN PAGE */}
            {role === 'ADMIN' && (
                <div className="dashboard-panel">
                    <h2>🛡️ Admin Dashboard</h2>
                    <p style={{color: '#7f8c8d', marginBottom: '20px'}}>
                        Review and approve pending employer registrations
                    </p>

                    {pendingEmployers.length === 0 ? (
                        <p style={{textAlign: 'center', color: '#95a5a6', padding: '40px'}}>
                            <i>No pending approvals at the moment.</i>
                        </p>
                    ) : (
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>Company</th>
                                    <th>Email</th>
                                    <th>Registration Date</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {pendingEmployers.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.companyName || 'N/A'}</td>
                                        <td>{user.email}</td>
                                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                        <td>
                                            <button
                                                onClick={() => handleApprove(user.id)}
                                                className="btn btn-primary btn-sm">
                                                Approve
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/*EMPLOYER PAGE */}
            {role === 'EMPLOYER' && (
                //
                <>
                    {/* Recent Applications Summary */}
                    <div className="summary-box">
                        <h3>📊 Recent Applications ({allApplications.length} total)</h3>
                        {allApplications.length === 0 ? (
                            <p style={{color: '#7f8c8d'}}>No applications yet. Post more jobs to attract candidates!</p>
                        ) : (
                            <ul className="application-list">
                                {allApplications.slice(0, 5).map(app => (
                                    <li key={app.id}>
                                        <strong>{app.applicant?.fullName || 'Candidate'}</strong> applied for{' '}
                                        <strong>{app.job?.title}</strong>
                                        <span className="date-badge">
                                            {new Date(app.createdAt || Date.now()).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Post Job Form */}
                    <div className="dashboard-panel">
                        <h3>📢 Post a New Job</h3>
                        <form onSubmit={handlePostJob} className="job-form">
                            <input
                                placeholder="Job Title (e.g., Senior Software Engineer)"
                                value={newJob.title}
                                onChange={e => setNewJob({...newJob, title: e.target.value})}
                                required
                            />
                            <textarea
                                placeholder="Job Description - Tell candidates what makes this role exciting..."
                                value={newJob.description}
                                onChange={e => setNewJob({...newJob, description: e.target.value})}
                                required
                                rows="4"
                            />
                            <div className="form-row">
                                <input
                                    placeholder="Location (e.g., New York, Remote)"
                                    value={newJob.location}
                                    onChange={e => setNewJob({...newJob, location: e.target.value})}
                                />
                                <input
                                    type="number"
                                    placeholder="Minimum Salary ($)"
                                    value={newJob.minSalary}
                                    onChange={e => setNewJob({...newJob, minSalary: (e.target.value)})}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Publish Job
                            </button>
                        </form>
                    </div>
                </>
            )}

            {/*Job listing*/}
            <div className="jobs-section">
                <div className="section-header">
                    <h2>{role === 'EMPLOYER' ? '📝 Your Job Posts' : '💼 Available Positions'}</h2>
                    <button
                        className="btn btn-outline"
                        onClick={role === 'EMPLOYER' ? loadMyJobs : handleClearSearch}>
                        🔄 Refresh
                    </button>
                </div>

                {/*Search bar (employee)*/}
                {role === 'EMPLOYEE' && (
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
                                        placeholder="e.g., Software Engineer, Software Designer..."
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
                                    disabled={isSearching}>
                                    {isSearching ? '⏳ Searching...' : '🔍 Search Jobs'}
                                </button>

                                {hasActiveFilters() && (
                                    <button
                                        type="button"
                                        onClick={handleClearSearch}
                                        className="btn btn-outline">
                                        ✕ Clear Filters
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                {/*Job Count */}
                <div className="job-count">
                    {hasActiveFilters() && role === 'EMPLOYEE' && <span>🎯 Search Results: </span>}
                    <strong>{(role === 'EMPLOYER' ? myJobs : jobs).length}</strong> job{(role === 'EMPLOYER' ? myJobs : jobs).length !== 1 ? 's' : ''}
                </div>

                {/*Jobs List */}
                <ul className="job-list">
                    {(role === 'EMPLOYER' ? myJobs : jobs).map(job => (
                        <li key={job.id} className="job-card">
                            <div className="job-card-content">
                                <div className="job-header">
                                    <h3>{job.title}</h3>
                                    <span className={`status-badge status-${job.status?.toLowerCase()}`}>
                                        {job.status || 'OPEN'}
                                    </span>
                                </div>

                                <div className="job-meta">
                                    <span>📍 {job.location || 'Remote'}</span>
                                    <span>💰 ${job.minSalary?.toLocaleString() || 'Negotiable'}</span>
                                    <span>🕒 {new Date(job.createdAt).toLocaleDateString()}</span>
                                </div>

                                <p className="job-description">
                                    {job.description ?
                                        (job.description.length > 200 ?
                                                job.description.substring(0, 200) + '...' :
                                                job.description
                                        ) :
                                        'No description provided'
                                    }
                                </p>

                                <div className="job-actions">
                                    {role === 'EMPLOYER' ? (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleViewApplicants(job.id)}>
                                            {selectedJobId === job.id ? '▼ Hide Applicants' : '▶ View Applicants'}
                                        </button>
                                    ) : role === 'EMPLOYEE' ? (
                                        <button
                                            className="btn btn-primary btn-sm"
                                            onClick={() => handleApply(job.id)}>
                                            Apply Now →
                                        </button>
                                    ) : null}
                                </div>

                                {/*Applicants  (Yellow Box) */}
                                {role === 'EMPLOYER' && selectedJobId === job.id && (
                                    <div className="detail-box">
                                        <h4>👥 Applicants for "{job.title}"</h4>
                                        {applications.length === 0 ? (
                                            <p style={{color: '#7f8c8d', textAlign: 'center', padding: '20px'}}>
                                                No applicants yet. Share this role to get more visibility!
                                            </p>
                                        ) : (
                                            <ul className="applicants-list">
                                                {applications.map(app => (
                                                    <li key={app.id} className="applicant-item">
                                                        <div className="applicant-info">
                                                            <strong>{app.applicant?.fullName || 'Unknown'}</strong>
                                                            <div style={{color: '#7f8c8d', fontSize: '0.9rem'}}>
                                                                {app.applicant?.email}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {app.applicant?.cv ? (
                                                                <a
                                                                    href={getCvDownloadUrl(app.applicant.cv)}
                                                                    target="_blank"
                                                                    rel="noreferrer"
                                                                    className="btn btn-sm btn-outline">
                                                                    📄 Download CV
                                                                </a>
                                                            ) : (
                                                                <span style={{color: '#e74c3c', fontSize: '0.85rem'}}>
                                                                    No CV uploaded
                                                                </span>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>

                {/*Empty State*/}
                {/*no job found (employee)*/}
                {/*no job post (employer)*/}
                {(role === 'EMPLOYER' ? myJobs : jobs).length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No jobs found</h3>
                        <p>
                            {role === 'EMPLOYER' ?
                                "You haven't posted any jobs yet. Create your first posting above!" :
                                hasActiveFilters() ?
                                    "No jobs match your search criteria. Try adjusting your filters." :
                                    "No open positions available at the moment. Check back later!"
                            }
                        </p>
                    </div>
                )}
            </div>

            {/*EMPLOYEE PAGE */}
            {role === 'EMPLOYEE' && (
                <div className="dashboard-panel">
                    <h3>👤 Your Profile</h3>
                    <p style={{marginBottom: '15px', color: '#7f8c8d'}}>
                        Upload your CV to make it easier for employers to review your application.
                    </p>
                    <div className="cv-upload">
                        <input
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx"
                        />
                        <button
                            onClick={handleUpload}
                            className="btn btn-primary btn-sm"
                            disabled={!selectedFile}>
                            📤 Upload CV
                        </button>
                    </div>
                    {selectedFile && (
                        <p style={{marginTop: '10px', color: '#27ae60', fontSize: '0.9rem'}}>
                            ✓ Selected: {selectedFile.name}
                        </p>
                    )}
                </div>
            )}

        </div>
    );
}

export default Dashboard;