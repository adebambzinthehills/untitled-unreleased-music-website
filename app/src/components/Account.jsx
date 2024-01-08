import React from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useAuth, logOut} from '../contexts/AuthContext';

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
        <div className=''>
            <Header></Header>
            <h3>This is the account page.</h3>
            <button className='logOutBtn btn btn-danger' onClick={() => handleLogOut()}>Log Out</button>
        </div>
    )
}

export default Account
