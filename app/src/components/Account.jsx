import React, { useContext, useState } from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { logOut} from '../contexts/AuthContext';
import { MdAccountCircle, MdAddPhotoAlternate } from "react-icons/md";
import '../css/Account.css';
import background from '../images/b.png';
import { PlayerContext } from '../contexts/PlayerContext';

function Account() {
    const { playerOff } = useContext(PlayerContext);
    const[imageActive, setImageActive] = useState(false);
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

    function handleClick() {
        const input = document.getElementsByClassName('profile-management-input')[0];
        input.click();
    }


    return (
        <div className='accountPageBackground'>
            {/* <img src={background}></img> */}
            <Header></Header>
            <div className='container account'>
                <div className='accountDetails'>
                    <h1>Your Account</h1>
                    <div className='iconWrapper'>
                        
                        <div className='profile-manager-image-wrapper' >
                            <div className='profile-manager-image-content' 
                                   >
                                <div className='profile-hover-information'>
                                    {/* this will appear on hover of image-content div */}
                                    <div>
                                        <div className='hover-unit-wrapper'>
                                            <div className='hover-icon'><span><MdAddPhotoAlternate/></span></div>
                                        </div>
                                        <div className='hover-unit-wrapper'>
                                            <div className='hover-text'><span>Choose photo</span></div>
                                        </div>
                                    </div>
                                </div>
                                {/* {imageActive ? <img/> : <div className='accountIcon'><MdAccountCircle /></div>} */}
                                <div className='profile-manager-image'>
                                    <img/>
                                </div>
                                {/* this below should display none and take up full width and height of div */}
                                <input className="profile-management-input" type="file" accept='image/jpg, image/png, image/jpeg, image/webp'/>
                                <div className='profile-management-input-click-div'>
                                    <button className='profile-management-input-button' onClick={() => handleClick()}></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='section'>
                        <div className='editDetailsHeader container'>
                            <h2>Edit Details</h2>
                        </div>
                        <div className='form details'>
                            <div className='form-group'>
                                <h4>Artist Name</h4>
                                <input className='account'></input>
                            </div>
                            <div className='form-group'>
                                <h4>Email Address</h4>
                                <input className='account'></input>
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
