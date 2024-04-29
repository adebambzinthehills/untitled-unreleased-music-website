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

    const { resetPassword, currentUser} = useAuth();
    const [waiting, setWaiting] = useState(false);

    useEffect(() => {
        //checks if user is currently logged in when trying to access page. takes straight to library instead.
        if (currentUser) {
        navigate("/Library");
        }
    }, [currentUser, navigate]);
    
    async function formHandler(e){
        e.preventDefault();

        setWaiting(true);
        resetPassword(email, password).then(() => {
            alert("Password email sent! Please check your inbox.")
            navigate("/login");
        }).catch((error) => {
            console.log("Error sending password reset email! : ", error)
            alert("Error sending password reset email!")
        });
          
          //button becomes activated again.
        setWaiting(false);


    }

    return (
        <div className='fullBackgroundBlack'>
            <div className='container'>
                <div className='enterDetails'>
                    <h1>Forgot your password?</h1>
                    <form>
                        <div className="form-group">
                            <label htmlFor="createEmail">What's your email address?</label>
                            <input type="email" value={email} required className='form-control' id="createEmail" placeholder='Enter your email address for your account...'
                            onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <button type="submit" className='detailsButton' disabled={waiting} onClick={formHandler}> Reset Password </button> 
                        <p className='small detailsParagraph'><span>Remember your password? </span><br></br><Link className="switchPageLink" to="/login">Login!</Link></p>
                    </form>  
                </div>
            </div>
        </div>
        
    )
}

export default CreateAccount