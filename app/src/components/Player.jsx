import React, { useContext, useEffect, useState, useRef, useCallback }from 'react'
import '../css/Player.css'
import '../css/ProgressBar.css'
import { PlayerContext } from '../contexts/PlayerContext';

import { TiArrowShuffle } from "react-icons/ti"
import { FaPlay, FaPlus } from 'react-icons/fa'
import { IoIosSkipBackward } from "react-icons/io"
import { FaPause } from "react-icons/fa6"
import { IoMdPause } from "react-icons/io"
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { HiOutlineQueueList } from "react-icons/hi2";
import { TbMicrophone2 } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs"
import { IoChevronBack } from "react-icons/io5";

import ColorThief from 'colorthief';

import { tracks } from '../audio/TemporaryTracks';

function Player() {
    const [shufflePlayer, setShufflePlayer] = useState(false);
    const [repeatCount, setRepeatCount] = useState(0);
    const [repeatOn, setRepeatOn] = useState(false);
    const [playPress, setPlayPress] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const music = useRef();
    const [trackIndex, setTrackIndex] = useState(0);
    const [currentTrack, setCurrentTrack] = useState(tracks[trackIndex]);
    const [duration, setDuration] = useState(0);

    const {playerOn, play, stop, toggle, playerImgSrc, changePlayerImage,
        miniplayerEnabled, enableMiniplayer, removeMiniplayer, 
        enableFullscreenPlayer, disableFullscreenPlayer} = useContext(PlayerContext);  

    const [playerBackgroundColour, setPlayerBackgroundColour] = useState("");
    const [playerFullscreen, setPlayerFullscreen] = useState(false);

    const progressBarRef = useRef();
    const [timeProgress, setTimeProgress] = useState(0);

    const animationRef = useRef();

    

    useEffect(() => {

        const documentBody = document.body;

        if(playerFullscreen){
            documentBody.style.overflow = 'hidden';
        }
        else{
            documentBody.style.overflow = 'unset';
            documentBody.style.paddingRight = '0px';
        }

    }, [playerFullscreen]);
    
    useEffect(() => {
        const awaitPromise = new Promise((resolve) => {
            const contentImage = new Image();
            contentImage.src = playerImgSrc;
            contentImage.crossOrigin = 'anonymous';
            contentImage.onload = () => {
                const colorThief = new ColorThief();
                resolve(colorThief.getColor(contentImage));
            }
        })

        awaitPromise.then((res) => {
            console.log(res);
            setPlayerBackgroundColour(res)

        }).catch((err) => {
            console.log(err);
            alert("Couldn't display player background colour!");
        })


    }, [])

    const playerColourValue = 'rgb(' + playerBackgroundColour + ')';
    let newPlayerColourValues = [];
    for(let i = 0; i < playerBackgroundColour.length; i++){
        newPlayerColourValues.push(playerBackgroundColour[i] - 50);
    }
    newPlayerColourValues = 'rgb(' + newPlayerColourValues + ')';

    const playerColour ={
        backgroundColor: newPlayerColourValues
    }

    const handleShuffle = () => {
        setShufflePlayer(!shufflePlayer);
        
    } 

    function handleRepeat(){
        let newCount = (repeatCount + 1) % 3;

        if(newCount == 1){
            //green on repeat (one_)
            setRepeatOn(true);
        }
        else if (newCount == 2){
        }
        else {
            //white repeat
            setRepeatOn(false);
        }

        setRepeatCount(newCount);

    };

    function handlePlayPress() {
        setPlayPress(!playPress);
        setIsPlaying(!isPlaying);
    }

    // ----------- IMPORTANT CODE FOR PLAYING BELOW -------------
     
    const repeatAnimationFrame = useCallback(() => {

        if(playerOn){
            if(music.current && progressBarRef.current){
            const currentTime = music.current.currentTime;

            setTimeProgress(currentTime);
            
            progressBarRef.current.value = currentTime;
            progressBarRef.current.style.setProperty(
                '--range-progress',
                `${(progressBarRef.current.value / duration) * 100}%`
            );

            animationRef.current = requestAnimationFrame(repeatAnimationFrame);
            }
        }
        
    }, [music, duration, progressBarRef, setTimeProgress]);

    useEffect(() => {
        if(isPlaying){
            music.current.play();
        }
        else {
            music.current.pause();
        }
        animationRef.current = requestAnimationFrame(repeatAnimationFrame);
    }, [isPlaying, music, repeatAnimationFrame, playerFullscreen])


    const greenShuffle = shufflePlayer ? 'green-shuffle' : '';
    const greenRepeat = repeatOn? 'green-repeat' : '';

    const screenSize = window.innerWidth;
    const [miniplayerTracker, setMiniplayerTracker] = useState(false);

    useEffect(() => {
        if(screenSize <= 600){
            enableMiniplayer();
            setMiniplayerTracker(true);
        }
        else{
            removeMiniplayer();
            setMiniplayerTracker(false);
        }
    }, [miniplayerTracker]);

    /* ---------- PROGRESS BAR ----------- */
    

    function handleProgress(){
        // allows you to move the progress bar and set the music time and value
        music.current.currentTime = progressBarRef.current.value;
    }

    function onLoadedMetadata (){
        const seconds = music.current.duration;
        setDuration(seconds);
        progressBarRef.current.max = seconds;
      };

    function formatTime(time){
        if (time && !isNaN(time)) {
          const minutes = Math.floor(time / 60);
          const formatMinutes =
            minutes < 10 ? `0${minutes}` : `${minutes}`;
          const seconds = Math.floor(time % 60);
          const formatSeconds =
            seconds < 10 ? `0${seconds}` : `${seconds}`;
          return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };
    
    function skipPlay() {
        setPlayPress(true);
        setIsPlaying(true);
    }
    //confirm state update when track
    useEffect(() => { console.log('New track index', trackIndex)}, [trackIndex] )

    function handleSkip() {
        let currentIndex = trackIndex;
        
        if(!(repeatCount == 2)){
            if(repeatCount == 0){
                if(currentIndex >= (tracks.length - 1) ){
                    currentIndex = 0
                    setPlayPress(false);
                    setIsPlaying(false);    
                    setTrackIndex((currentIndex));
                    setCurrentTrack(tracks[currentIndex])
                    console.log("I'm here too somewhere!")
                }
                else{
                    skipPlay();
                    setTrackIndex((currentIndex + 1));
                    setCurrentTrack(tracks[currentIndex + 1])
                }
                
            }
            else{
                if(trackIndex >= tracks.length - 1 ){
                    setTrackIndex(0);
                    currentIndex = 0
                    setCurrentTrack(tracks[currentIndex]);
                }
                else{
                    setTrackIndex(currentIndex + 1);
                    setCurrentTrack(tracks[currentIndex + 1])
                    skipPlay();
                }
            }
        }
        else {
            progressBarRef.current.currentTime = 0;
            music.current.currentTime = 0;
            music.current.play();
        }
    }

    function handleReload() {
        let currentIndex = trackIndex;
        if(!(repeatCount == 2)){
            if(!(music.current.currentTime <= 3) && currentIndex != 0){
                if(music.current.currentTime <= 0.5){
                    if(trackIndex == 0){
                        currentIndex = tracks.length - 1;
                        setTrackIndex(currentIndex);
                        setCurrentTrack(tracks[currentIndex]);
                    }
                    else{
                        setTrackIndex(currentIndex- 1);
                        setCurrentTrack(tracks[currentIndex - 1])
                    }
                }
                else{
                    progressBarRef.current.currentTime = 0;
                    music.current.currentTime = 0;
                }
            }
            else {
                if(trackIndex == 0){
                    currentIndex = 0
                    setTrackIndex(currentIndex);
                    setCurrentTrack(tracks[currentIndex]);
                    progressBarRef.current.currentTime = 0;
                    music.current.currentTime = 0;
                }
                else{
                    setTrackIndex(currentIndex- 1);
                    setCurrentTrack(tracks[currentIndex - 1])
                }
                music.current.play();
            }
        }
        else {
            progressBarRef.current.currentTime = 0;
            music.current.currentTime = 0;
        }
        setPlayPress(true);
        setIsPlaying(true);  
    }


  return (

    <div>
    <audio src={currentTrack.src} ref={music} onLoadedMetadata={() => onLoadedMetadata()} onEnded={() => handleSkip()}/>
      <div className='player-container'>
        <div className='row player-row'>
            <div className='col-3 player-col'>
                <div className='left-information-wrapper'>
                    <div className='player-image-wrapper'>
                        <button className='player-image-button'><img className='player-image' src={(currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail }></img></button>
                    </div>
                    <div className='player-song-information-wrapper'>
                        <div>
                            <span className='player-song-name'><a>{currentTrack.title}</a></span>
                        </div>
                        <div className='span-information-wrap'>
                            <span className='player-artist-name'>{currentTrack.author}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-6'>
                <div className='player-controls-wrapper'>
                    <div className='player-buttons-wrapper'>
                        <div className='player-button-wrapper'>
                            <button className={'player-shuffle-button ' + greenShuffle} onClick={() => handleShuffle()}><span><TiArrowShuffle/></span></button>
                            {shufflePlayer && <span className='player-shuffle-button-dot'><GoDotFill/></span>}
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-rewind-button' onClick={() => handleReload()}><span><IoIosSkipBackward/></span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='player-pause-button'/> : <FaPlay/>}</span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-skip-button' onClick={() => handleSkip()}><span><IoIosSkipBackward/></span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className={'player-repeat-button ' + greenRepeat} onClick={() => handleRepeat()}><span>{repeatCount <= 1? <LuRepeat/> : <LuRepeat1/>}</span></button>
                            {(repeatCount === 1 || repeatCount === 2) && <span className='player-repeat-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>
                    <div className='player-scrollbar-wrapper'>
                        <div className='player-time-wrapper'><span className='player-time-left'>{formatTime(timeProgress)}</span></div>
                        <div className='player-scrollbar'>
                            {/* <div className='player-scrollbar-grey'>
                                <div className='player-scrollbar-overlay'>
                                    <div className='player-scrollbar-dot'></div>
                                </div>
                            </div> */}
                            <input className="player-scrollbar-input" type="range" onChange={() => handleProgress()} ref={progressBarRef}></input>
                        </div>
                        <div className='player-time-wrapper'><span className='player-time-right'>{formatTime(duration)}</span></div>
                    </div>
                </div>
            </div>
            <div className='col-3'>
                <div className='right-information-wrapper'>
                    <div className='player-lyrics-wrapper'>
                        <button className='player-lyrics-button'><span><TbMicrophone2/></span></button>
                    </div>
                    <div className='player-queue-wrapper'>
                        <button className='player-queue-button'><span><HiOutlineQueueList/></span></button>
                    </div>
                </div>
            </div>
        </div>
      </div>
      <div className='miniplayer-container' style={playerColour}>
        <div className='row miniplayer-row'>
            <div className='col-10 player-col '>
                <div className='miniplayer-left-information-wrapper'>
                    <div className='miniplayer-image-wrapper'>
                        <button className='miniplayer-image-button'><img className='miniplayer-image' src={(currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail }></img></button>
                    </div>
                    <div className='miniplayer-song-information-wrapper'>
                        <div>
                            <span className='player-song-name'><a>{currentTrack.title}</a></span>
                        </div>
                        <div className='span-information-wrap'>
                            <span className='player-artist-name'>{currentTrack.author}</span>
                        </div>
                    </div>
                </div>
                <div className='miniplayer-full-button-wrapper'><button className='miniplayer-full-button' onClick={() => {setPlayerFullscreen(true); document.body.style.overflow = 'hidden'; enableFullscreenPlayer()}}></button></div>
            </div>
            <div className='col-2 player-col miniplayer-play-pause'>
                <div className='miniplayer-control-wrapper'>
                    <div className='miniplayer-play-button-wrapper'>
                        <button className='miniplayer-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='miniplayer-pause-button'/> : <FaPlay/>}</span></button>
                    </div>
                </div>
            </div>
        </div>
      </div>
        <div className='fullscreen-player' style={playerFullscreen? 
            {display: 'block'} : {display: 'none'}}>
        <div className='fullscreen-player-header row'> 
            <div className='col-2 fullscreen-player-close'>
                <button className="fullscreen-player-close-button" onClick={() => {setPlayerFullscreen(false); disableFullscreenPlayer();}}>
                    <span><IoChevronBack/></span>
                </button>
            </div>
            <div className='col-8 fullscreen-player-content-title-wrapper'>
                <div className='fullscreen-player-content-title'>
                    <span>{currentTrack.album}</span>
                </div>
            </div>
            <div className='col-2 fullscreen-player-three-dots'>
                <div className='fullscreen-player-three-dots-wrapper'>
                    <button className='fullscreen-player-three-dots-button'>
                        <span><BsThreeDots/></span>
                    </button>
                </div>
            </div>
        </div>
        <div className='fullscreen-player-image-section'>
            <div className='fullscreen-player-image-wrapper'>
                <div className='fullscreen-player-image-square'>
                    <img className='fullscreen-player-image' src={(currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail }/>
                </div>
            </div> 
        </div>
        <div className='fullscreen-player-information-section'>
            <div className='fullscreen-player-information-wrapper'>
                <div className='fullscreen-player-song-title'>
                    <span><h1>{currentTrack.title}</h1></span>
                </div>
                <div className='fullscreen-player-artist-name'>
                    <span>{currentTrack.author}</span>
                </div>
            </div>
        </div>
        <div className='fullscreen-player-rest-section'>
            <div className='fullscreen-player-controls-wrapper'>
                <div className='player-scrollbar-wrapper'>
                    <div className='player-time-wrapper'><span className='player-time-left'>{formatTime(timeProgress)}</span></div>
                    <div className='player-scrollbar'>
                        {/* <div className='player-scrollbar-grey'>
                            <div className='player-scrollbar-overlay'>
                                <div className='player-scrollbar-dot'></div>
                            </div>
                        </div> */}
                        <input className="player-scrollbar-input" type="range" onChange={() => handleProgress()} ref={progressBarRef}></input>
                    </div>
                    <div className='player-time-wrapper'><span className='player-time-right'>{formatTime(duration)}</span></div>
                </div>
                <div className='fullscreen-buttons-wrapper row'>
                    <div className='col-2-4 player-buttons-section-col'>
                        <div className='fullscreen-button-wrapper float-left'>
                            <button className={'player-shuffle-button ' + greenShuffle} onClick={() => handleShuffle()}><span><TiArrowShuffle/></span></button>
                            {shufflePlayer && <span className='player-shuffle-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>
                    <div className='col-2-4'>
                        <div className='fullscreen-button-wrapper media-flex-middle'>
                            <button className='player-rewind-button' onClick={() => handleReload()}><span><IoIosSkipBackward/></span></button>
                        </div>
                    </div>
                    <div className='col-2-4 player-buttons-section-col flex-middle'>
                        <div className='fullscreen-button-wrapper'>
                            <button className='player-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='player-pause-button'/> : <FaPlay/>}</span></button>
                        </div>
                    </div>
                    <div className='col-2-4 player-buttons-section-col'>
                        <div className='fullscreen-button-wrapper media-flex-middle'>
                            <button className='player-skip-button' onClick={() => handleSkip()}><span><IoIosSkipBackward/></span></button>
                        </div>
                    </div>
                    <div className='col-2-4'>
                        <div className='fullscreen-button-wrapper float-right'>
                            <button className={'player-repeat-button ' + greenRepeat} onClick={() => handleRepeat()}><span>{repeatCount <= 1? <LuRepeat/> : <LuRepeat1/>}</span></button>
                            {(repeatCount === 1 || repeatCount === 2) && <span className='player-repeat-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>  
                </div>
            </div>
            <div className='fullscreen-bottom-right'>
                <div className='fullscreen-right-information-wrapper'>
                    <div className='player-lyrics-wrapper'>
                        <button className='player-lyrics-button'><span><TbMicrophone2/></span></button>
                    </div>
                    <div className='player-queue-wrapper'>
                        <button className='player-queue-button'><span><HiOutlineQueueList/></span></button>
                    </div>
                </div>
            </div>
        </div>   
        </div>
      
    </div>
  )
}

export default Player
