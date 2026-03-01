import React, {useState, useEffect} from 'react';
import './App.css';
// import {login, register, fetchJobs, applyJob, uploadCv, createJob, fetchApplications, getCvDownloadUrl, fetchPendingEmployers, approveEmployers, getMyJobs, getMyApplication} from './api/api';
import {Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";

function App() {
  // localStorage.clear()
  // login and register
  // const [isLoginView, setIsLoginView] = useState(true);
  // const [fullName, setFullName] = useState('');
  // const [email, setEmail] = useState('');
  // const [password, setPassword] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  // const [selectedFile, setSelectedFile] = useState(null);
  // const [jobs, setJobs] = useState([]);
  const [role, setRole] = useState(localStorage.getItem('role') || 'EMPLOYEE');
  // const [companyName, setCompanyName] = useState('');
  // const [newJob, setNewJob] = useState({title: '', description: '', location: '', salaryMin: 0});
  // const [selectedJobId, setSelectedJobId] = useState(null);
  // admin
  // const [pendingEmployers, setPendingEmployers] = useState([]);
  const [token, setToken] = useState(localStorage.getItem('token')); // chekc if user login

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    setRole(localStorage.getItem('role'));
    setUserId(localStorage.getItem('userId'));
    setUsername(localStorage.getItem('username'))
  }, [location]);

  const handleLogout = () => {
    localStorage.clear();
    setToken(null);
    setUsername(null);
    setRole(null);
    setUserId(null);
    navigate('/login')
  }

  // useEffect(() => {
  //   if (role === 'ADMIN' && token) {
  //     loadPendingEmployers();
  //   }
  // }, [role, token]);
  // const handleRegister = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await register({fullName, email, password, role, companyName: role === 'EMPLOYER'? companyName: null});
  //     alert("Registration Successful!");
  //     // go to login
  //     setIsLoginView(true);
  //   } catch (error) {
  //     alert("Registration Failed: " + (error.response?.data || error.message));
  //   }
  // };
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   try {
  //     const response = await login(email, password);
  //     const data = response.data;
  //     console.log("Login Success!", data);
  //     // save token in browser
  //     localStorage.setItem('token', data.token);
  //     localStorage.setItem('userId', data.userId);
  //     localStorage.setItem('username', data.username)
  //     localStorage.setItem('role', data.role)
  //     setToken(data.token);
  //     setUserId(data.userId);
  //     setUsername(data.username);
  //     setRole(data.role);
  //     alert(`Welcome back! ${data.username}`);
  //   } catch (error) {
  //     const errorMsg = error.response?.data || "Login failed";
  //     if(error.response?.status === 403){
  //       alert('Access denied! You account is waiting for approval.');
  //     }
  //     else if(error.response?.status === 401){
  //       alert('Login Failed! Incorrect username or password');
  //     }
  //     else{
  //       alert("Error: " + errorMsg);
  //     }
  //   }
  // };
  // const handlePostJob = async (e) => {
  //   e.preventDefault();
  //   try {
  //     await createJob(newJob);
  //     alert("Job Posted Successfully!");
  //     setNewJob({ title: '', description: '', location: '', salaryMin: 0}); // Reset form
  //     getJobs(); // Refresh immediate
  //     loadMyJobs();
  //   } catch (error) {
  //     alert("Failed to post job.");
  //   }
  // };
  //
  // const [allApplications, setAllApplications] = useState([]);
  // const [applications, setApplications] = useState([]);
  // const [myJobs, setMyJobs] = useState([]);
  // const loadMyJobs = async () => {
  //   try{
  //     console.log("Loading Dashboard Data...");
  //
  //     const jobsRes = await getMyJobs();
  //     setMyJobs(jobsRes.data);
  //     const applicationsRes = await getMyApplication();
  //     setAllApplications(applicationsRes.data);
  //   }
  //   catch (error){
  //     console.error("Failed to load jobs dashboard");
  //   }
  // };
  // useEffect(() => {
  //   if(token && role === 'EMPLOYER'){
  //     loadMyJobs();
  //   }
  // }, [role, token]);
  // const handleFileChange = (e) => {
  //   setSelectedFile(e.target.files[0]);
  // };
  //
  // const handleUpload = async () => {
  //   if (!selectedFile) return alert("Please select a file!");
  //   if (!userId) return alert("Please login.");
  //
  //   try {
  //     await uploadCv(userId, selectedFile);
  //     alert("CV Uploaded!");
  //   } catch (error) {
  //     console.error(error);
  //     alert("Upload Failed: " + (error.response?.data?.message || error.message));
  //   }
  // };
  //
  // const handleViewApplicants = async (jobId) => {
  //   try {
  //     const response = await fetchApplications(jobId);
  //     setApplications(response.data);
  //     setSelectedJobId(jobId);
  //     alert(`Found ${response.data.length} applicants!`);
  //   } catch (error) {
  //     alert("Could not load applicants");
  //   }
  // };
  //
  //
  //
  // const getJobs = async () => {
  //   try {
  //     // handle token
  //     const response = await fetchJobs();
  //     setJobs(response.data);
  //   } catch (error) {
  //     alert('Oops! No job found. Are you logged in?');
  //   }
  // };
  //
  //
  //
  //
  // // apply job
  // const handleApply = async (jobId) => {
  //   if (!userId) {
  //     return alert("Please login.");
  //   }
  //   try {
  //     await applyJob(jobId, userId);
  //     alert("Application Successful!");
  //   } catch (error) {
  //     console.error(error);
  //     // check error
  //     const message = error.response?.data?.message || 'Application Failed';
  //     alert(message);
  //   }
  // };
  //
  // // Load the list of pending employers
  // const loadPendingEmployers = async () => {
  //   try {
  //     const response = await fetchPendingEmployers();
  //     setPendingEmployers(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch pending users", error);
  //   }
  // };
  // const loadPendingEmployers = async () => {
  //   try {
  //     const response = await fetchPendingEmployers();
  //     setPendingEmployers(response.data);
  //   } catch (error) {
  //     console.error("Failed to fetch pending users", error);
  //     alert("Error fetching list: " + (error.response?.data || error.message));
  //   }
  // };
  //
  // // approve onclick
  // const handleApprove = async (userId) => {
  //   if(!window.confirm("Are you sure you want to approve this employer?")) return;
  //
  //   try {
  //     console.log("Attempting to approve user ID:", userId);
  //     await approveEmployers(userId);
  //     alert("User Approved!");
  //     loadPendingEmployers(); // Refresh the list
  //   } catch (error) {
  //     console.log(error)
  //     alert("Failed to approve.");
  //   }
  // };

  // return (
  //     <div>
  //       <h1>Job Board System</h1>
  //
  //       {/*Login or Register*/}
  //       {!token ? (
  //           <div>
  //             <h2>{isLoginView ? 'Login' : 'Create Account'}</h2>
  //             <form onSubmit={isLoginView ? handleLogin : handleRegister}>
  //               {!isLoginView && (
  //                   <input
  //                       placeholder="Full Name"
  //                       value={fullName}
  //                       onChange={e => setFullName(e.target.value)}
  //                       required
  //                   />
  //               )}
  //               <input
  //                   placeholder="Email"
  //                   type="email"
  //                   value={email}
  //                   onChange={e => setEmail(e.target.value)}
  //                   required
  //               />
  //               <input type="password"
  //                      placeholder="Password"
  //                      value={password}
  //                      onChange={e => setPassword(e.target.value)}
  //                      required
  //               />
  //               {!isLoginView && (
  //                   <select
  //                       value={role}
  //                       onChange={e => setRole(e.target.value)}
  //                   >
  //                     <option value="EMPLOYEE">Applicant</option>
  //                     <option value="EMPLOYER">Employer</option>
  //                   </select>
  //               )}
  //               {!isLoginView && role === 'EMPLOYER' && (
  //                   <div>
  //                     <label>Company Name: </label>
  //                     <input type="text"
  //                            placeholder="Google..."
  //                            value={companyName}
  //                            onChange={(e) => setCompanyName(e.target.value)} required/>
  //                   </div>
  //               )}
  //               <button type="submit">
  //                 {isLoginView ? 'Login' : 'Register'}
  //               </button>
  //             </form>
  //
  //             <p>
  //               {isLoginView ? "Don't have an account? " : "Already have an account? "}
  //               <span
  //                   onClick={() => setIsLoginView(!isLoginView)}
  //               >
  //             {isLoginView ? "Register here" : "Login here"}
  //           </span>
  //             </p>
  //           </div>
  //       ) : (
  //           /* LOGGED IN */
  //           <div>
  //             <div>
  //               <h2>Dashboard</h2>
  //               <button onClick={() => {
  //                 localStorage.clear();
  //                 setToken(null);
  //               }}>Logout
  //               </button>
  //               {role === 'EMPLOYER' && (
  //                   <div>
  //                     <h3>📢 Post a New Job</h3>
  //                     <form onSubmit={handlePostJob}>
  //
  //                       <input
  //                           placeholder="Job Title (e.g. Java Dev)"
  //                           value={newJob.title}
  //                           onChange={e => setNewJob({...newJob, title: e.target.value})}
  //                           required
  //                       />
  //
  //                       <textarea
  //                           placeholder="Job Description"
  //                           value={newJob.description}
  //                           onChange={e => setNewJob({...newJob, description: e.target.value})}
  //                           required
  //                       />
  //
  //                       <div>
  //                         <input
  //                             placeholder="Location"
  //                             value={newJob.location}
  //                             onChange={e => setNewJob({...newJob, location: e.target.value})}
  //                         />
  //                         <input
  //                             type="number"
  //                             placeholder="Min Salary"
  //                             value={newJob.salaryMin}
  //                             onChange={e => setNewJob({...newJob, salaryMin: e.target.value})}
  //                         />
  //                       </div>
  //
  //                       <button type="submit">
  //                         Post Job
  //                       </button>
  //                     </form>
  //                   </div>
  //               )}
  //             </div>
  //
  //             {role === 'EMPLOYER' && (
  //                 <div>
  //                   <h3>👥 Recent Applications (Total: {allApplications.length})</h3>
  //                   {allApplications.length === 0 ? (
  //                       <p>No applications received yet.</p>
  //                   ) : (
  //                       <ul style={{ maxHeight: '150px', overflowY: 'auto', paddingLeft: '20px' }}>
  //                         {allApplications.map(app => (
  //                             <li key={app.id} style={{ marginBottom: '15px', padding: '10px', borderBottom: '2px solid' }}>
  //                               <div>
  //                                 <strong>{app.applicant?.fullName || 'Candidate'}</strong> applied for
  //                               </div>
  //                               <div>
  //                                 <strong> {app.job?.title}</strong>
  //                               </div>
  //                               <div>
  //                                 <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
  //                                   ({new Date(app.appliedAt || Date.now()).toLocaleDateString()})
  //                                 </span>
  //                               </div>
  //                             </li>
  //                         ))}
  //                       </ul>
  //                   )}
  //                 </div>
  //             )}
  //
  //             {role === 'EMPLOYER' && (
  //                 <div style={{
  //                   marginTop: '20px',
  //                   padding: '15px',
  //                   border: '2px solid #007bff',
  //                   borderRadius: '8px',
  //                   backgroundColor: '#f0f8ff'
  //                 }}>
  //                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
  //                     <h3 style={{color: '#0056b3'}}>📂 My Job Posts</h3>
  //                     <button onClick={loadMyJobs} style={{cursor: 'pointer', fontSize: '12px'}}>Refresh</button>
  //                   </div>
  //
  //                   {myJobs.length === 0 ? <p>You haven't posted any jobs yet.</p> : (
  //                       <ul style={{listStyle: 'none', padding: 0}}>
  //                         {myJobs.map(job => (
  //                             <li key={job.id} style={{
  //                               background: 'white',
  //                               border: '1px solid #ddd',
  //                               padding: '10px',
  //                               marginBottom: '10px',
  //                               borderRadius: '5px'
  //                             }}>
  //                               <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
  //                                 <div>
  //                                   <strong>{job.title}</strong>
  //                                   <div style={{fontSize: '12px', color: '#666'}}>
  //                                     Status: <span style={{
  //                                     fontWeight: 'bold',
  //                                     color: job.status === 'OPEN' ? 'green' : 'red'
  //                                   }}>{job.status}</span>
  //                                   </div>
  //                                 </div>
  //
  //                                 <button
  //                                     onClick={() => handleViewApplicants(job.id)}
  //                                     style={{
  //                                       backgroundColor: '#007bff',
  //                                       color: 'white',
  //                                       border: 'none',
  //                                       padding: '5px 10px',
  //                                       borderRadius: '4px',
  //                                       cursor: 'pointer'
  //                                     }}
  //                                 >
  //                                   View Applicants
  //                                 </button>
  //                               </div>
  //                               {selectedJobId === job.id && (
  //                                   <div style={{
  //                                     marginTop: '10px',
  //                                     padding: '10px',
  //                                     backgroundColor: '#9f9f9f',
  //                                     border: '1px solid'
  //                                   }}>
  //                                     <h4>Applicants for {job.title}:</h4>
  //                                     {applications.length === 0 ? <p>No applications yet.</p> : (
  //                                         <ul>
  //                                           {applications.map(app => (
  //                                               <li key={app.id} style={{marginBottom: '10px', borderBottom: '1px solid', paddingBottom: '10px'}}>
  //                                                 <div>
  //                                                   <strong>Full Name:</strong> {app.applicant?.fullName}
  //                                                 </div>
  //                                                 <div>
  //                                                   {app.applicant?.cv? (
  //                                                       <a href={getCvDownloadUrl(app.applicant.cv)} target="_blank" rel="noreferrer"
  //                                                          style={{marginLeft: '10px', color: 'blue'}}>
  //                                                         Download CV
  //                                                       </a>
  //                                                   ) : (
  //                                                       <span style={{marginLeft: '10px', color: 'red'}}>No CV</span>
  //                                                   )}
  //                                                 </div>
  //                                               </li>
  //                                           ))}
  //                                         </ul>
  //                                     )}
  //                                   </div>
  //                               )}
  //                             </li>
  //                         ))}
  //                       </ul>
  //                   )}
  //                 </div>
  //
  //
  //             )}
  //
  //             {role === 'ADMIN' && (
  //                 <div style={{
  //                   padding: '20px',
  //                   backgroundColor: '#fff3e0',
  //                   border: '2px solid #ffb74d',
  //                   borderRadius: '8px',
  //                   marginBottom: '20px'
  //                 }}>
  //                   <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
  //                     <h2 style={{color: '#e65100', margin: 0}}>🛡️ Admin Dashboard</h2>
  //                     <button onClick={loadPendingEmployers} style={{padding: '8px', cursor: 'pointer'}}>Refresh List
  //                     </button>
  //                   </div>
  //
  //                   <p>Manage pending employer registrations.</p>
  //
  //                   {pendingEmployers.length === 0 ? (
  //                       <p><i>No pending approvals.</i></p>
  //                   ) : (
  //                       <table
  //                           style={{width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: 'white'}}>
  //                         <thead>
  //                         <tr style={{background: '#ffcc80'}}>
  //                           <th style={{padding: '10px', border: '1px solid #ddd'}}>ID</th>
  //                           <th style={{padding: '10px', border: '1px solid #ddd'}}>Email</th>
  //                           <th style={{padding: '10px', border: '1px solid #ddd'}}>Date Joined</th>
  //                           <th style={{padding: '10px', border: '1px solid #ddd'}}>Action</th>
  //                         </tr>
  //                         </thead>
  //                         <tbody>
  //                         {pendingEmployers.map(user => (
  //                             <tr key={user.id}>
  //                               <td style={{
  //                                 padding: '10px',
  //                                 border: '1px solid #ddd',
  //                                 textAlign: 'center'
  //                               }}>{user.id}</td>
  //                               <td style={{padding: '10px', border: '1px solid #ddd'}}>{user.email}</td>
  //                               <td style={{
  //                                 padding: '10px',
  //                                 border: '1px solid #ddd'
  //                               }}>{new Date(user.createdAt).toLocaleDateString()}</td>
  //                               <td style={{padding: '10px', border: '1px solid #ddd', textAlign: 'center'}}>
  //                                 <button
  //                                     onClick={() => handleApprove(user.id)}
  //                                     style={{
  //                                       backgroundColor: '#28a745',
  //                                       color: 'white',
  //                                       border: 'none',
  //                                       padding: '5px 10px',
  //                                       cursor: 'pointer',
  //                                       borderRadius: '4px'
  //                                     }}>
  //                                   ✅ Approve
  //                                 </button>
  //                               </td>
  //                             </tr>
  //                         ))}
  //                         </tbody>
  //                       </table>
  //                   )}
  //                 </div>
  //             )}
  //             {/*  CV */}
  //             {role === 'EMPLOYEE' && (
  //                 <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px'}}>
  //                   <h3>My Profile</h3>
  //                   <p>Upload your CV so employers can see it.</p>
  //
  //                   <input type="file" onChange={handleFileChange}/>
  //
  //                   <button
  //                       onClick={handleUpload}
  //                       style={{
  //                         marginLeft: '10px',
  //                         backgroundColor: '#6c757d',
  //                         color: 'white',
  //                         border: 'none',
  //                         padding: '5px 10px',
  //                         cursor: 'pointer'
  //                       }}
  //                   >
  //                     Upload CV
  //                   </button>
  //                 </div>
  //             )}
  //
  //             <button onClick={getJobs} style={{padding: '10px 20px', marginBottom: '20px', marginTop: '10px'}}>
  //               Load Open Jobs
  //             </button>
  //
  //             <ul style={{listStyle: 'none', padding: 0}}>
  //               {jobs.map(job => (
  //                   <li key={job.id}
  //                       style={{border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px'}}>
  //                     <div style={{display: 'flex', justifyContent: 'space-between'}}>
  //                       <div>
  //                         <strong>{job.title}</strong>
  //                         <div style={{color: '#666'}}>{job.location} — ${job.salaryMin}</div>
  //                       </div>
  //                       {role === 'EMPLOYEE' && (
  //                           <button onClick={() => handleApply(job.id)} style={{
  //                             backgroundColor: '#28a745',
  //                             color: 'white',
  //                             border: 'none',
  //                             padding: '8px 16px',
  //                             borderRadius: '4px',
  //                             cursor: 'pointer'
  //                           }}>
  //                             Apply
  //                           </button>
  //                       )}
  //                       {/*{role === 'EMPLOYER' && (*/}
  //                       {/*    <button onClick={() => handleViewApplicants(job.id)} style={{*/}
  //                       {/*      backgroundColor: '#28a745',*/}
  //                       {/*      color: 'white',*/}
  //                       {/*      border: 'none',*/}
  //                       {/*      padding: '8px 16px',*/}
  //                       {/*      borderRadius: '4px',*/}
  //                       {/*      cursor: 'pointer'*/}
  //                       {/*    }}>*/}
  //                       {/*      View Applicants*/}
  //                       {/*    </button>*/}
  //                       {/*)}*/}
  //                     </div>
  //
  //                   </li>
  //               ))}
  //             </ul>
  //           </div>
  //       )}
  //     </div>
  // );

  return (
      <div className="page">
        {/* Navbar (sticky) */}
        <nav className="navbar">
          <div className="container nav-content">
            {/*Should go to home page when I have one*/}
            <div className="logo"><a href={"/home"}>ComeJob</a></div>
            {token && (
                <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
                  <span>Welcome, <strong>{username}</strong></span>
                  {role === 'ADMIN' && <span className={"admin-btn"}>Admin login</span>}
                  <button className="btn btn-outline" onClick={handleLogout}>Logout</button>
                </div>
            )}
          </div>
        </nav>

        {/*Routing links*/}
        <div className="main">
          <Routes>
            <Route path={"/login"} element={!token? <Login/> : <Navigate to = "/dashboard"/>}></Route>
            <Route path={"/dashboard"} element={token? <Dashboard role={role} userId={userId} token={token}/> : <Navigate to = "/login"/>}></Route>
            <Route path={"*"} element={<Navigate to={token? "/dashboard" : "/login"}/>}></Route>
          </Routes>
        </div>

        {/*<div className="container" style={{ marginTop: '40px' }}>*/}

        {/*  /!* 2. Authentication View *!/*/}
        {/*  {!token ? (*/}
        {/*      <div className="auth">*/}
        {/*        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>*/}
        {/*          {isLoginView ? 'Welcome Back' : 'Create Account'}*/}
        {/*        </h2>*/}
        {/*        <form onSubmit={isLoginView ? handleLogin : handleRegister}>*/}
        {/*          {!isLoginView && (*/}
        {/*              <input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />*/}
        {/*          )}*/}
        {/*          <input placeholder="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />*/}
        {/*          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />*/}

        {/*          {!isLoginView && (*/}
        {/*              <select value={role} onChange={e => setRole(e.target.value)} style={{ marginBottom: '15px' }}>*/}
        {/*                <option value="EMPLOYEE">I am a Candidate</option>*/}
        {/*                <option value="EMPLOYER">I am an Employer</option>*/}
        {/*              </select>*/}
        {/*          )}*/}

        {/*          {!isLoginView && role === 'EMPLOYER' && (*/}
        {/*              <input placeholder="Company Name" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />*/}
        {/*          )}*/}

        {/*          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '10px' }}>*/}
        {/*            {isLoginView ? 'Login' : 'Register'}*/}
        {/*          </button>*/}
        {/*        </form>*/}
        {/*        <p style={{ textAlign: 'center', marginTop: '15px', color: '#6b7280' }}>*/}
        {/*          {isLoginView ? "New here? " : "Already have an account? "}*/}
        {/*          <span onClick={() => setIsLoginView(!isLoginView)} style={{ color: 'var(--primary-color)', cursor: 'pointer', fontWeight: '600' }}>*/}
        {/*            {isLoginView ? "Create account" : "Login"}*/}
        {/*          </span>*/}
        {/*        </p>*/}
        {/*      </div>*/}
        {/*  ) : (*/}
        {/*      <div>*/}
        {/*        /!* Employer: Post Job Section *!/*/}
        {/*        {role === 'EMPLOYER' && (*/}
        {/*            <div className="dashboard-panel">*/}
        {/*              <h3>📢 Post a New Opportunity</h3>*/}
        {/*              <form onSubmit={handlePostJob} style={{ display: 'grid', gap: '15px' }}>*/}
        {/*                <input placeholder="Job Title (e.g. UX Designer)" value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} required />*/}
        {/*                <textarea placeholder="Job Description..." value={newJob.description} onChange={e => setNewJob({...newJob, description: e.target.value})} required rows="3" />*/}
        {/*                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>*/}
        {/*                  <input placeholder="Location" value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} />*/}
        {/*                  <input type="number" placeholder="Min Salary" value={newJob.salaryMin} onChange={e => setNewJob({...newJob, salaryMin: e.target.value})} />*/}
        {/*                </div>*/}
        {/*                <button type="submit" className="btn btn-primary" style={{ justifySelf: 'start' }}>Publish Job</button>*/}
        {/*              </form>*/}
        {/*            </div>*/}
        {/*        )}*/}

        {/*        /!* Job Listings (Joinrs Style Cards) *!/*/}
        {/*        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>*/}
        {/*          <h2>{role === 'EMPLOYER' ? 'Your Job Posts' : 'Recommended Jobs'}</h2>*/}
        {/*          <button className="btn btn-outline" onClick={role === 'EMPLOYER' ? loadMyJobs : getJobs}>Refresh List</button>*/}
        {/*        </div>*/}

        {/*        <ul className="job-list">*/}
        {/*          {(role === 'EMPLOYER' ? myJobs : jobs).map(job => (*/}
        {/*              <li key={job.id} className="job-card">*/}
        {/*                <div className="job-info">*/}
        {/*                  <h3>{job.title}</h3>*/}
        {/*                  <div className="job-meta">*/}
        {/*                    <span>📍 {job.location || 'Remote'}</span>*/}
        {/*                    <span>💰 ${job.salaryMin}</span>*/}
        {/*                    {job.status && (*/}
        {/*                        <span className="badge">{job.status}</span>*/}
        {/*                    )}*/}
        {/*                  </div>*/}
        {/*                  <p style={{ color: '#666', fontSize: '0.95rem' }}>*/}
        {/*                    {job.description ? job.description.substring(0, 100) + '...' : 'No description'}*/}
        {/*                  </p>*/}

        {/*                  /!* View Applicants / Apply Actions *!/*/}
        {/*                  <div style={{ marginTop: '15px' }}>*/}
        {/*                    {role === 'EMPLOYER' ? (*/}
        {/*                        <button className="btn btn-primary" onClick={() => handleViewApplicants(job.id)}>*/}
        {/*                          View Applicants*/}
        {/*                        </button>*/}
        {/*                    ) : (*/}
        {/*                        <button className="btn btn-primary" onClick={() => handleApply(job.id)}>*/}
        {/*                          Apply Now*/}
        {/*                        </button>*/}
        {/*                    )}*/}
        {/*                  </div>*/}

        {/*                  /!* Yellow Box Logic (Inside the card for better flow) *!/*/}
        {/*                  {role === 'EMPLOYER' && selectedJobId === job.id && (*/}
        {/*                      <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>*/}
        {/*                        <h4 style={{ margin: '0 0 10px 0' }}>Applicants</h4>*/}
        {/*                        {applications.length === 0 ? <p style={{color: '#666'}}>No applicants yet.</p> : (*/}
        {/*                            <ul style={{ listStyle: 'none', padding: 0 }}>*/}
        {/*                              {applications.map(app => (*/}
        {/*                                  <li key={app.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', marginBottom: '8px' }}>*/}
        {/*                                    <strong>{app.applicant?.fullName}</strong>*/}
        {/*                                    {app.applicant?.cv && (*/}
        {/*                                        <a href={getCvDownloadUrl(app.applicant.cv)} target="_blank" rel="noreferrer" style={{ marginLeft: '10px', color: 'var(--primary-color)' }}>*/}
        {/*                                          Download CV*/}
        {/*                                        </a>*/}
        {/*                                    )}*/}
        {/*                                  </li>*/}
        {/*                              ))}*/}
        {/*                            </ul>*/}
        {/*                        )}*/}
        {/*                      </div>*/}
        {/*                  )}*/}
        {/*                </div>*/}
        {/*              </li>*/}
        {/*          ))}*/}
        {/*        </ul>*/}

        {/*        /!* Employee: CV Upload *!/*/}
        {/*        {role === 'EMPLOYEE' && (*/}
        {/*            <div className="dashboard-panel" style={{ marginTop: '40px' }}>*/}
        {/*              <h3>👤 Your Profile</h3>*/}
        {/*              <p style={{marginBottom: '10px'}}>Upload your CV to be visible to top employers.</p>*/}
        {/*              <div style={{ display: 'flex', gap: '10px' }}>*/}
        {/*                <input type="file" onChange={handleFileChange} style={{ border: 'none', padding: 0 }} />*/}
        {/*                <button onClick={handleUpload} className="btn btn-primary">Upload CV</button>*/}
        {/*              </div>*/}
        {/*            </div>*/}
        {/*        )}*/}
        {/*      </div>*/}
        {/*  )}*/}
        {/*</div>*/}
      </div>
  );
}

export default App;