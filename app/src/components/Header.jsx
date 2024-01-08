import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { auth } from '../firebase';

function Header() {

    return (
        <div className='header container'>
            <h3>You are logged into the Spotify Preview website.</h3>
            <button className='btn btn-success'><Link to="/account">Account</Link></button>
        </div>
    )
}

export default Header
