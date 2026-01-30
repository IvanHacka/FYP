import React, {useState} from 'react';
import {login, register, fetchJobs, applyJob, uploadCv, createJob, fetchApplications, getCvDownloadUrl} from './api/api';

function App() {
  // login and register
  const [isLoginView, setIsLoginView] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [selectedFile, setSelectedFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [role, setRole] = useState(localStorage.getItem('role') || 'EMPLOYEE');
  const [newJob, setNewJob] = useState({title: '', description: '', location: '', salaryMin: 0});
  const [applications, setApplications] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register({fullName, email, password, role});
      alert("Registration Successful!");
      // go to login
      setIsLoginView(true);
    } catch (error) {
      alert("Registration Failed: " + (error.response?.data || error.message));
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login(email, password);
      const data = response.data;
      console.log("Login Success!", data);
      // save token in browser
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.userId);
      localStorage.setItem('username', data.username)
      setToken(data.token);
      setUserId(data.userId);
      alert(`Welcome back! ${data.username}`);
    } catch (error) {
      alert('Login Failed! Incorrect username or password');
      console.error(error);
    }
  };
  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      await createJob(newJob);
      alert("Job Posted Successfully!");
      setNewJob({ title: '', description: '', location: '', salaryMin: 0}); // Reset form
      getJobs(); // Refresh immediate
    } catch (error) {
      alert("Failed to post job.");
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
    } catch (error) {
      console.error(error);
      alert("Upload Failed: " + (error.response?.data?.message || error.message));
    }
  };

  const handleViewApplicants = async (jobId) => {
    try {
      const response = await fetchApplications(jobId);
      setApplications(response.data);
      setSelectedJobId(jobId);
      alert(`Found ${response.data.length} applicants!`);
    } catch (error) {
      alert("Could not load applicants");
    }
  };



  const getJobs = async () => {
    try {
      // handle token
      const response = await fetchJobs();
      setJobs(response.data);
    } catch (error) {
      alert('Oops! No job found. Are you logged in?');
    }
  };

  // apply job
  const handleApply = async (jobId) => {
    if (!userId) {
      return alert("Please login.");
    }
    try {
      await applyJob(jobId, userId);
      alert("Application Successful!");
    } catch (error) {
      console.error(error);
      // check error
      const message = error.response?.data?.message || 'Application Failed';
      alert(message);
    }
  };

  return (
      <div style={{ padding: '20px', fontFamily: 'Arial', maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{textAlign: 'center'}}>Job Board System</h1>

        {/*Login or Register*/}
        {!token ? (
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
              <h2>{isLoginView ? 'Login' : 'Create Account'}</h2>
              <form onSubmit={isLoginView ? handleLogin : handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {!isLoginView && (
                    <input
                        placeholder="Full Name"
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                        style={{ padding: '10px' }}
                    />
                )}
                <input
                    placeholder="Email"
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px' }}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px' }}
                />
                {!isLoginView && (
                    <select
                        value={role}
                        onChange={e => setRole(e.target.value)}
                        style={{ padding: '10px' }}
                    >
                      <option value="EMPLOYEE">Employee</option>
                      <option value="EMPLOYER">Employer</option>
                    </select>
                )}
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                  {isLoginView ? 'Login' : 'Register'}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: '15px' }}>
                {isLoginView ? "Don't have an account? " : "Already have an account? "}
                <span
                    onClick={() => setIsLoginView(!isLoginView)}
                    style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
              {isLoginView ? "Register here" : "Login here"}
            </span>
              </p>
            </div>
        ) : (
            /* LOGGED IN */
            <div>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <h2>Dashboard</h2>
                <button onClick={() => {
                  localStorage.clear();
                  setToken(null);
                }} style={{background: 'red', color: 'white', border: 'none', padding: '5px 10px'}}>Logout
                </button>
                {role === 'EMPLOYER' && (
                    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '1px solid #90caf9' }}>
                      <h3>📢 Post a New Job</h3>
                      <form onSubmit={handlePostJob} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

                        <input
                            placeholder="Job Title (e.g. Java Dev)"
                            value={newJob.title}
                            onChange={e => setNewJob({...newJob, title: e.target.value})}
                            required
                            style={{ padding: '8px' }}
                        />

                        <textarea
                            placeholder="Job Description"
                            value={newJob.description}
                            onChange={e => setNewJob({...newJob, description: e.target.value})}
                            required
                            style={{ padding: '8px', minHeight: '60px' }}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <input
                              placeholder="Location"
                              value={newJob.location}
                              onChange={e => setNewJob({...newJob, location: e.target.value})}
                              style={{ flex: 1, padding: '8px' }}
                          />
                          <input
                              type="number"
                              placeholder="Min Salary"
                              value={newJob.salaryMin}
                              onChange={e => setNewJob({...newJob, salaryMin: e.target.value})}
                              style={{ width: '100px', padding: '8px' }}
                          />
                        </div>

                        <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '10px', border: 'none', cursor: 'pointer' }}>
                          Post Job
                        </button>
                      </form>
                    </div>
                )}

              {/*  CV */}
              </div>
              {role === 'EMPLOYEE' && (
                <div style={{marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px'}}>
                  <h3>My Profile</h3>
                  <p>Upload your CV so employers can see it.</p>

                  <input type="file" onChange={handleFileChange}/>

                  <button
                      onClick={handleUpload}
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                        cursor: 'pointer'
                      }}
                  >
                    Upload CV
                  </button>
                </div>
              )}

              <button onClick={getJobs} style={{padding: '10px 20px', marginBottom: '20px', marginTop: '10px'}}>
                Load Open Jobs
              </button>

              <ul style={{listStyle: 'none', padding: 0}}>
                {jobs.map(job => (
                    <li key={job.id}
                        style={{border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '8px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <div>
                          <strong>{job.title}</strong>
                          <div style={{color: '#666'}}>{job.location} — ${job.salaryMin}</div>
                        </div>
                        {role === 'EMPLOYEE' && (
                            <button onClick={() => handleApply(job.id)} style={{
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}>
                              Apply
                            </button>
                        )}
                        {role === 'EMPLOYER' && (
                            <button onClick={() => handleViewApplicants(job.id)} style={{
                              backgroundColor: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}>
                              View Applicants
                            </button>
                        )}
                      </div>
                      {role === 'EMPLOYER' && selectedJobId === job.id && (
                          <div style={{ marginTop: '10px', padding: '10px', backgroundColor: '#fff3cd', border: '1px solid #ffeeba' }}>
                            <h4>Applicants for {job.title}:</h4>
                            {applications.length === 0 ? <p>No applications yet.</p> : (
                                <ul>
                                  {applications.map(app => (
                                      <li key={app.id}>
                                        {/* Note: app.employee might need to be fetched depending on your Entity JSON */}
                                        Employee ID: {app.employee?.id}
                                        {app.employee?.cv ? (
                                            <a href={getCvDownloadUrl(app.employee.cv)} target="_blank" rel="noreferrer" style={{marginLeft: '10px', color: 'blue'}}>
                                              Download CV
                                            </a>
                                        ) : (
                                            <span style={{marginLeft: '10px', color: 'red'}}>No CV</span>
                                        )}
                                      </li>
                                  ))}
                                </ul>
                            )}
                          </div>
                          )}
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
}

export default App;