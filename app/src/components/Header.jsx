import React from 'react'

function Header({loggedIn, setLoggedIn}) {

    function logOut(){
        setLoggedIn(!loggedIn);
    }

    return (
        <div className='header container'>
            <h3>You are logged into the Spotify Preview website.</h3>
            <button className='logOutBtn btn btn-danger' onClick={() => logOut()}>Log Out</button>
        </div>
    )
}

export default Header
