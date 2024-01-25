import React from 'react'
import Tracklist from '../components/Tracklist'
import Header from './Header'
import { useNavigate, useLocation } from 'react-router-dom'
import "../css/MusicContent.css"

function Album() {
    const {state} = useLocation();
    const navigate = useNavigate();

    function goBack() {
        navigate(-1);
    }

    return (
        <div className='page'>
            <Header></Header>   
            <div className='container'>
                <button onClick={()=> goBack()}>Back</button>
            <div className='music-header'>
                <div className='music-header-album-cover'>
                    <button className='music-header-cover-button'>
                        <img className="content-cover" src={state.image}></img>
                    </button>
                </div>
                <div className = "music-content-information">
                    <div className='music-header-content-wrapper'>
                        <span className='music-header-content-type'>{state.type}</span>
                        <h1>{state.title}</h1>
                        <span className='music-header-content-artist'>{state.artist} • 2024 </span>
                    </div>
                </div>
            </div>
            <div className='music-content-functions'>
                
            </div>
            <Tracklist></Tracklist>
            </div>
        </div>
    )
}

export default Album
