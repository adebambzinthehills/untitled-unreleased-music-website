import React, {useState, useEffect, useContext } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import googleLogo from '../images/google.png';
import "../css/App.css";
import "../css/LoginCreateAccount.css";

function CreateAccount() {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { currentUser, signup, logOut, signInWithGoogle } = useAuth();
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        //checks if user is currently logged in when trying to access page. takes straight to library instead.
        if (currentUser) {
        navigate("/Library");
        }
    }, [currentUser, navigate]);
    
    async function formHandler(e){
        e.preventDefault();
        
        if(password !== confirmPassword){
            return alert("The passwords entered don't match each other. Please try again!")
        }

        // try {
            setWaiting(true);
            signup(email, password).then((userCreds) => {
                navigate("/library");
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });
        //   } catch (e) {
        //     alert("Failed to Sign Up!");
        //   }
          
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
                    <h1>Create an Account for Preview</h1>
                    <button className='googleButton' onClick={() => googleSignIn()}>
                        <img alt='Google Logo' src={googleLogo}/>
                        <span>Sign up with Google</span>
                    </button>
                    <hr></hr>
                    <form>
                        <div className="form-group">
                            <label htmlFor="createEmail">Email address</label>
                            <input type="email" value={email} required className='form-control' id="createEmail" placeholder='Enter your email address to sign up with'
                            onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="createPassword">Password</label>
                            <input type="password" value={password} required className='form-control' id="createPassword" placeholder='Enter your password.'
                            onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="createConfirmPassword">Confirm Password</label>
                            <input type="password" value={confirmPassword} required className='form-control' id="createConfirmPassword" placeholder='Confirm your password.'
                            onChange={(e) => setConfirmPassword(e.target.value)}/>
                        </div>
                        <button type="submit" className='detailsButton' disabled={waiting} onClick={formHandler}> Create Account </button> 
                        <p className='small detailsParagraph'><span>Already have an account? </span><br></br><Link className="switchPageLink" to="/login">Login!</Link></p>
                    </form>  
                </div>
            </div>
        </div>
        
    )
}

export default CreateAccount