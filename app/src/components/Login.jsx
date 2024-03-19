import React, {useState, useEffect, useContext} from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import googleLogo from '../images/google.png';
import "../css/App.css";
import "../css/LoginCreateAccount.css";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { currentUser, login, signInWithGoogle } = useAuth();
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

    async function googleSignIn(){
        signInWithGoogle().then(() => {
            navigate("/library");
        }).catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    return (
        <div className='fullBackgroundBlack'>
            <div className='container'>
                <div className='enterDetails'>
                    <h1>Login to Preview</h1>
                    <button className='googleButton' onClick={() => {googleSignIn()}} disabled={waiting}>
                        <img alt='Google Logo' src={googleLogo}/>
                        <span>Sign in with Google</span>
                    </button>
                    <hr></hr>
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
                        <button type="submit" className=' detailsButton' onClick={formHandler} disabled={waiting}> Log In </button> 
                        <p className='forgotPassword'><Link className='switchPageLink' to="/forgot-password">Forgot Password?</Link></p>
                        {/* <p className='small detailsParagraph'><span>Don't have an account? </span><br></br><Link className='switchPageLink' to="/createaccount">Create one!</Link></p> */}
                    </form> 
                </div>
            </div>
        </div>
    )
}

export default Login
