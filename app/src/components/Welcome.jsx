import '../css/Welcome.css';
import icon from '../images/spotify-white-icon.png';
import { NavLink, useNavigate } from 'react-router-dom';
import React, {useState, useEffect, useContext} from "react";
import { RiFolderMusicLine } from "react-icons/ri";

function Login({loggedIn, setLoggedIn}){
    
  const navigate = useNavigate();

    return (
      <div className='login container'>
        {/* <RiFolderMusicLine className='welcomeIcon'/> */}
        {/* <img className='loginImg' src={icon} alt="spotify white logo"/> */}
        <div className='welcome-content'>
          <h1>Welcome to Preview!</h1>
          <p>This website is built for artists to simulate what 
            their unreleased music will look and sound like on the platform way before it goes live,
            helping you to make more creative decisions, and focus on the experience of the music.</p>
          <button className='loginBtn btn btn-success' onClick={() => navigate("/login")} > Let's start your Preview experience.</button>
          <p className='small'>This is a solo student developer project by Ayomide Balogun as part 
          of his third year project. </p>
          <p className='small' style={{fontSize:'0.6rem'}}>This project is still HEAVILY under development, so there will be a few bugs!</p>
        </div>
      </div>
    )
}

export default Login
