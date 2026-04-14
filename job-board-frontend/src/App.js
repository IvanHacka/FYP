import React, {useState, useEffect} from 'react';
import './App.css';
// import {login, register, fetchJobs, applyJob, uploadCv, createJob, fetchApplications, getCvDownloadUrl, fetchPendingEmployers, approveEmployers, getMyJobs, getMyApplication} from './api/api';
import {Link, Routes, Route, Navigate, useLocation, useNavigate} from "react-router-dom";
import ProfilePage from "./components/profile/Profile.js";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard.js";
import Admin from "./AdminPanel.js";
import WatchListPage from "./components/jobs/WatchListPage.js";

function App() {
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [userId, setUserId] = useState(localStorage.getItem('userId'));
  const [role, setRole] = useState(localStorage.getItem('role') || 'EMPLOYEE');
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUsername(null);
    setRole(null);
    setUserId(null);
    navigate('/login')
  }

  return (
      <div className="page">
        <nav className="navbar">
          <div className="container nav-content">
            {/*Should go to home page when I have one*/}
            <div className="logo"><Link to="/dashboard">ComeJob</Link></div>
            {token && (
                <div className="nav-right">
                  <span>Welcome, <strong>{username}</strong></span>
                  {role === 'ADMIN' && (<span className="admin-btn">Admin login</span>)}
                  <Link to="/watchlist" className="watchlist-link" title="My Watch List">WatchList</Link>
                  <Link to="/profile">My Profile</Link>
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
            <Route path={"/profile"} element={token? <ProfilePage role={role}/> : <Navigate to="/login"/>}></Route>
            <Route path={"/admin"} elemenet={<Admin/>}></Route>
            <Route path={"/watchlist"} element={token ? <WatchListPage /> : <Navigate to="/login" />}></Route>
            <Route path={"*"} element={<Navigate to={token? "/dashboard" : "/login"}/>}></Route>
          </Routes>
        </div>
      </div>
  );
}

export default App;