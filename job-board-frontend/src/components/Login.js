import React, {useState} from "react";
import {useNavigate} from 'react-router-dom';
import {login, register} from '../api/api';

function Login(){
    const [isLoginView, setIsLoginView] = useState(true);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState("EMPLOYEE");
    const [companyName, setCompanyName] = useState('');

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await register({fullName, email, password, role, companyName: role === 'EMPLOYER'? companyName: null});
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

            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            const user = {
                id: data.userId,
                email: data.username,
                fullName: data.fullName,
                role: data.role
            };
            localStorage.setItem('user', JSON.stringify(user));


            alert(`Welcome back! ${data.username}`);
            navigate('/dashboard'); // Go to dashboard
        } catch (error) {
            const errorMsg = error.response?.data || "Login failed";
            if(error.response?.status === 403){
                alert('Access denied! You account is waiting for approval.');
            }
            else if(error.response?.status === 401){
                alert('Login Failed! Incorrect username or password');
            }
            else{
                alert("Error: " + errorMsg);
            }
        }
    };


    return (
        <div className="container" style={{marginTop: '40px'}}>
            <div className="auth">
                <h2 style={{textAlign: 'center', marginBottom: '20px'}}>
                    {isLoginView ? 'Welcome Back' : 'Create Account'}
                </h2>
                <form onSubmit={isLoginView ? handleLogin : handleRegister} className="auth-form">
                    {!isLoginView && (
                        <input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)}
                               required/>
                    )}
                    <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                           required/>
                    <input type="password" placeholder="Password" value={password}
                           onChange={e => setPassword(e.target.value)} required/>

                    {!isLoginView && (
                        <select value={role} onChange={e => setRole(e.target.value)}>
                            <option value="EMPLOYEE">I am a Candidate</option>
                            <option value="EMPLOYER">I am an Employer</option>
                        </select>
                    )}

                    {!isLoginView && role === 'EMPLOYER' && (
                        <input placeholder="Company Name" value={companyName}
                               onChange={e => setCompanyName(e.target.value)} required/>
                    )}

                    <button type="submit" className="btn btn-primary">
                        {isLoginView ? 'Login' : 'Register'}
                    </button>
                </form>

                <p style={{textAlign: 'center', marginTop: '15px'}}>
                    {isLoginView ? "New here? " : "Already have an account? "}
                    <span
                        onClick={() => setIsLoginView(!isLoginView)}
                        style={{cursor: 'pointer', fontWeight: '600'}}
                    >
                        {isLoginView ? "Create account" : "Login"}
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;