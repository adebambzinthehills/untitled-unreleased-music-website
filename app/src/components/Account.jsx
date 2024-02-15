import React, { useContext } from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { logOut} from '../contexts/AuthContext';
import { MdAccountCircle } from "react-icons/md";
import '../css/Account.css';
import background from '../images/b.png';
import { PlayerContext } from '../contexts/PlayerContext';

function Account() {
    const { playerOff } = useContext(PlayerContext);
    //const { logOut } = useAuth();
    const navigate = useNavigate();

    async function handleLogOut(){
        playerOff();
        try{
            await logOut();
            navigate("/");
        }
        catch(e){
            alert("Unable to log out!");
            console.log(e);
        }
    }

    return (
        <div className='accountPageBackground'>
            {/* <img src={background}></img> */}
            <Header></Header>
            <div className='container account'>
                <div className='accountDetails'>
                    <h1>Your Account</h1>
                    <div className='iconWrapper'>
                        <MdAccountCircle className='accountIcon'/>
                    </div>
                    <div className='section'>
                        <div className='editDetailsHeader container'>
                            <h2>Edit Details</h2>
                        </div>
                        <div className='form details'>
                            <div className='form-group'>
                                <h4>Artist Name</h4>
                                <input></input>
                            </div>
                            <div className='form-group'>
                                <h4>Email Address</h4>
                                <input></input>
                            </div>
                            <div className='row'>
                                <div className='col-md-3 col-sm-12 accountButton'>
                                    <button type="submit" className=' cancelChanges'> Cancel</button> 
                                </div>
                                <div className='col-md-9 col-sm-12 accountButton'>
                                    <button type="submit" className=' detailsButton' > Save Changes </button> 
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    <div className="accountButtonsSection row section">
                        <div className='col-md-6 col-sm-12 accountButton'>
                            <button className='logOutBtn' onClick={() => handleLogOut()}>Log Out</button>
                        </div>
                        <div className='col-md-6 col-sm-12 accountButton'>
                            <button className='deleteAccountBtn'>Delete Account</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Account
