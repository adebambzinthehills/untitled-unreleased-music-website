import React, { useContext, useEffect, useState }from 'react'
import '../css/Player.css'
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

function Player() {
    const [shufflePlayer, setShufflePlayer] = useState(false);
    console.log(shufflePlayer);
    const [repeatCount, setRepeatCount] = useState(0);
    const [repeatOn, setRepeatOn] = useState(false);
    const [playPress, setPlayPress] = useState(false);
    const {playerOn, play, stop, toggle, playerImgSrc, changePlayerImage, miniplayerEnabled, enableMiniplayer, removeMiniplayer} = useContext(PlayerContext);  
    const [playerBackgroundColour, setPlayerBackgroundColour] = useState("");
    const [playerFullscreen, setPlayerFullscreen] = useState(false);

    
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
    }


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

  return (

    <div>
      {
      <div className='player-container'>
        <div className='row player-row'>
            <div className='col-3 player-col'>
                <div className='left-information-wrapper'>
                    <div className='player-image-wrapper'>
                        <button className='player-image-button'><img className='player-image' src={playerImgSrc}></img></button>
                    </div>
                    <div className='player-song-information-wrapper'>
                        <div>
                            <span className='player-song-name'><a>Santa Barbara</a></span>
                        </div>
                        <div className='span-information-wrap'>
                            <span className='player-artist-name'>Jaden</span>
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
                            <button className='player-rewind-button'><span><IoIosSkipBackward/></span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='player-pause-button'/> : <FaPlay/>}</span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-skip-button'><span><IoIosSkipBackward/></span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className={'player-repeat-button ' + greenRepeat} onClick={() => handleRepeat()}><span>{repeatCount <= 1? <LuRepeat/> : <LuRepeat1/>}</span></button>
                            {(repeatCount === 1 || repeatCount === 2) && <span className='player-repeat-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>
                    <div className='player-scrollbar-wrapper'>
                        <div className='player-scrollbar'>
                            <div><span className='player-time-left'>0:00</span></div>
                            <div className='player-scrollbar-overlay'>
                                <div className='player-scrollbar-dot'></div>
                            </div>
                            <div className='player-scrollbar-grey'></div>
                            <div><span className='player-time-right'>2:22</span></div>
                        </div>
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
      </div>}
      {
      <div className='miniplayer-container' style={playerColour}>
        <div className='row miniplayer-row'>
            <div className='col-10 player-col '>
                <div className='miniplayer-left-information-wrapper'>
                    <div className='miniplayer-image-wrapper'>
                        <button className='miniplayer-image-button'><img className='miniplayer-image' src={playerImgSrc}></img></button>
                    </div>
                    <div className='miniplayer-song-information-wrapper'>
                        <div>
                            <span className='player-song-name'><a>Santa Barbara</a></span>
                        </div>
                        <div className='span-information-wrap'>
                            <span className='player-artist-name'>Jaden</span>
                        </div>
                    </div>
                </div>
                <div className='miniplayer-full-button-wrapper'><button className='miniplayer-full-button' onClick={() => {setPlayerFullscreen(true); document.body.style.overflow = 'hidden';}}></button></div>
            </div>
            <div className='col-2 player-col miniplayer-play-pause'>
                <div className='miniplayer-control-wrapper'>
                    <div className='miniplayer-play-button-wrapper'>
                        <button className='miniplayer-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='miniplayer-pause-button'/> : <FaPlay/>}</span></button>
                    </div>
                </div>
            </div>
        </div>
      </div>}
      { playerFullscreen &&
        <div className='fullscreen-player'>
        <div className='fullscreen-player-header row'> 
            <div className='col-4 fullscreen-player-close'>
                <button className="fullscreen-player-close-button" onClick={() => setPlayerFullscreen(false)}>
                    <span><IoChevronBack/></span>
                </button>
            </div>
            <div className='col-4 fullscreen-player-content-title-wrapper'>
                <div className='fullscreen-player-content-title'>
                    <span>#STILLSWAGGIN</span>
                </div>
            </div>
            <div className='col-4 fullscreen-player-three-dots'>
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
                    <img className='fullscreen-player-image' src={playerImgSrc}/>
                </div>
            </div> 
        </div>
        <div className='fullscreen-player-information-section'>
            <div className='fullscreen-player-information-wrapper'>
                <div className='fullscreen-player-song-title'>
                    <span><h1>Again (feat. SYRE)</h1></span>
                </div>
                <div className='fullscreen-player-artist-name'>
                    <span>Jaden</span>
                </div>
            </div>
        </div>
        <div className='fullscreen-player-rest-section'>
            <div className='fullscreen-player-controls-wrapper'>
                <div className='player-scrollbar-wrapper'>
                    <div className='fullscreen-scrollbar'>
                        <div><span className='player-time-left'>0:00</span></div>
                        <div className='fullscreen-scrollbar-overlay'>
                        <div className='player-scrollbar-dot'></div>
                    </div>
                    <div className='player-scrollbar-grey'></div>
                        <div><span className='player-time-right'>2:22</span></div>
                    </div>
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
                            <button className='player-rewind-button'><span><IoIosSkipBackward/></span></button>
                        </div>
                    </div>
                    <div className='col-2-4 player-buttons-section-col flex-middle'>
                        <div className='fullscreen-button-wrapper'>
                            <button className='player-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='player-pause-button'/> : <FaPlay/>}</span></button>
                        </div>
                    </div>
                    <div className='col-2-4 player-buttons-section-col'>
                        <div className='fullscreen-button-wrapper media-flex-middle'>
                            <button className='player-skip-button'><span><IoIosSkipBackward/></span></button>
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
      }
      
    </div>
  )
}

export default Player
