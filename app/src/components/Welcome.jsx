import '../css/Welcome.css';
import icon from '../images/spotify-white-icon.png';
import { NavLink, useNavigate } from 'react-router-dom';
import React, {useState, useEffect, useContext} from "react";

function Login({loggedIn, setLoggedIn}){
    
  const navigate = useNavigate();

    return (
      <div className='login container'>
        <img className='loginImg' src={icon} alt="spotify white logo"/>
        <h1>Welcome to Spotify Preview</h1>
        <p>This website is built for artists to simulate what 
          their unreleased music will look and sound like on the platform way before it goes live,
          helping you to make more creative decisions, and focus on the experience of the music.</p>
        <button className='loginBtn btn btn-success' onClick={() => navigate("/login")} > Let's start your Spotify Preview experience.</button>
        <p className='small'>This is a solo student developer project by Ayomide Balogun as part 
        of his third year project. </p>
      </div>
    )
}

export default Login
