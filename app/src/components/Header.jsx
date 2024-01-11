import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link , useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { MdAccountCircle } from "react-icons/md";
import '../css/Header.css';

function Header() {

    const navigate = useNavigate();

    function toAccount(){
        navigate("/account");
    }

    return (
        <div className='header'>
            <h3>Spotify Preview</h3>
            <button className='accountLinkButton' onClick={() => toAccount()}><MdAccountCircle/></button>
        </div>
    )
}

export default Header
