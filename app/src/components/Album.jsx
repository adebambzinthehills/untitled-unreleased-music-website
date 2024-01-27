import React, { useEffect, useRef } from 'react'
import Tracklist from '../components/Tracklist'
import Header from './Header'
import { useNavigate, useLocation } from 'react-router-dom'
import "../css/MusicContent.css"
import { FaPlay, FaPlus } from 'react-icons/fa'
import { TiArrowShuffle } from "react-icons/ti"
import { BsThreeDots } from "react-icons/bs"
import { useState } from 'react'
import { IoChevronBack } from "react-icons/io5"
import { GoDotFill } from "react-icons/go";
import ColorThief from 'colorthief';


export async function GetColour() {
    const {state} = useLocation();

    const awaitPromise = new Promise((resolve) => {
        const contentImage = new Image();
        contentImage.src = state.image;
        contentImage.crossOrigin = 'anonymous';
        contentImage.onload = () => {
            const colorThief = new ColorThief();
            resolve(colorThief.getColor(contentImage));
        }
    })

    const result = await awaitPromise;
    //console.log(result);
    return result;
}

function Album() {
    const {state} = useLocation();
    const navigate = useNavigate();
    const [shuffle, setShuffle] = useState(true);
    const [fullAlbumCover, setFullAlbumCover] = useState(false);
    const contentShuffleButton = shuffle ? 'green-content-shuffle-button' : 'content-shuffle-button';
    const contentShuffleDotVisible = shuffle? 'green-content-shuffle-dot' : 'green-content-shuffle-dot-invisible';
    const backgroundColorPrint = 'rgb(' + GetColour() + ')';
    const [backgroundColour, setBackgroundColour] = useState("");

    const musicHeaderColor ={
        backgroundColor: 'rgb(' + backgroundColour + ')',
        background: 'linear-gradient(rgb(' + backgroundColour + '), black)'
    }

    useEffect(() => {
        const awaitPromise = new Promise((resolve) => {
            const contentImage = new Image();
            contentImage.src = state.image;
            contentImage.crossOrigin = 'anonymous';
            contentImage.onload = () => {
                const colorThief = new ColorThief();
                resolve(colorThief.getColor(contentImage));
            }
        })

        awaitPromise.then((res) => {
            console.log(res);
            setBackgroundColour(res)

        }).catch((err) => {
            console.log(err);
            alert("Couldn't display album background colour!");
        })


    }, [])

    useEffect(() => {
        
        if(fullAlbumCover){
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = '15px';
        }
        else{
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

    }, [fullAlbumCover]);

    function goBack() {
        navigate(-1);
    }

    return (
        
        <div className='content-page'>
            <Header></Header>   
            
            <div className='content-background' style={musicHeaderColor}>
                <div className='container'>
                    <div className='back-button-row'>
                        <div className='back-button-wrapper'>
                            <button className="back-button" onClick={()=> goBack()}>
                                <span><IoChevronBack/></span>
                            </button>
                        </div>
                        <div className='back-button-row-block'></div>
                    </div>
                </div>
                <div className='container'>
                    <div className='music-header'>
                        <div className='music-header-album-cover'>
                            <button className='music-header-cover-button' onClick={() => setFullAlbumCover(true)}>
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
                        <div className='content-button-wrapper'>
                            <button className='content-play-button'><span><FaPlay></FaPlay></span></button>
                        </div>
                        <div className='content-other-functions'>
                            <div className='content-icon-wrapper'>
                                <button className={contentShuffleButton} onClick={()=> setShuffle(!shuffle)}><span><TiArrowShuffle/></span></button>
                                <span className={contentShuffleDotVisible}><GoDotFill/></span>
                            </div>
                            <div className='content-icon-wrapper'>
                                <button className='content-dots-button'><span><BsThreeDots/></span></button>
                            </div>
                        </div>
                    </div>
                    <div className='add-tracks-wrapper'>
                        <div>
                            <button className='content-add-tracks-button'><span><FaPlus/></span> Add Tracks</button>
                        </div>
                    </div>
                </div>
                <Tracklist></Tracklist>
                
            </div>
            {fullAlbumCover && <div className='fullscreen-album-cover-wrapper'>
                <div className='fullscreen-album-content'>
                    <div className='fullscreen-album-image-wrapper'>
                        <div className='cover-wrapper'>   
                            <img className='fullscreen-album-cover' src={state.image}/>
                            <div className='fullscreen-album-controls-wrapper'>
                                <div>
                                    <div className='fullscreen-album-controls'>
                                        <div className='fullscreen-control-wrapper' id='fcw-change-button'>
                                            <button className='fullscreen-change-button'>Change</button>
                                        </div>
                                        <div className='fullscreen-control-wrapper'>
                                            <button className='fullscreen-close-button' onClick={()=> setFullAlbumCover(false)}>Close</button>                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='fullscreen-album-clickable' onClick={()=> setFullAlbumCover(false)}>

                    </div>
                </div>
            </div>}
        </div>
    )
}

export default Album
