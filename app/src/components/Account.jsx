import React from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { logOut} from '../contexts/AuthContext';
import { MdAccountCircle } from "react-icons/md";
import '../css/Account.css';

function Account() {

    //const { logOut } = useAuth();
    const navigate = useNavigate();

    async function handleLogOut(){
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
        <div className='fullBackgroundBlack'>
            <Header></Header>
            <div className='container'>
                <div className='accountDetails'>
                    <h1>Your Account</h1>
                    <div className='iconWrapper'>
                        <MdAccountCircle className='accountIcon'/>
                    </div>
                    <div className='section'>
                        <h3>Edit Details</h3>
                    </div>
                    <button className='logOutBtn' onClick={() => handleLogOut()}>Log Out</button>
                </div>
            </div>
        </div>
    )
}

export default Account
