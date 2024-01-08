import React, {useState, useEffect, useContext} from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import "../css/App.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { currentUser, login } = useAuth();
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        //checks if user is currently logged in when trying to access page. takes straight to library instead.
        if (currentUser) {
        navigate("/Library");
        }
    }, [currentUser, navigate]);
    
    async function formHandler(e){
        e.preventDefault();
        
        try {
            setWaiting(true);
            await login(email, password);
            navigate("/library");
          } catch (e) {
            alert("Failed to Login!");
          }
          
          //button becomes activated again.
          setWaiting(false);
    }

    return (
        <div className=''>
            <h3>Login to Spotify Preview</h3>
            <form>
                <div className="form-group">
                    <label htmlFor="loginEmail">Email address</label>
                    <input type="email" value={email} autoComplete='email' required className='form-control' id="loginEmail" placeholder='Enter your email address used for your account.'
                    onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="form-group">
                    <label htmlFor="loginPassword">Password</label>
                    <input type="password" value={password} autoComplete='password' required className='form-control' id="loginPassword" placeholder='Enter your password.'
                    onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className='btn btn-success' onClick={formHandler}> Log In </button> 
                <p className='small'><Link to="/createaccount">Don't have an account? Create one!</Link></p>
            </form>
        </div>
    )
}

export default Login
