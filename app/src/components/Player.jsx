import React, { useContext, useState }from 'react'
import '../css/Player.css'
import { PlayerContext } from '../contexts/PlayerContext';

import { TiArrowShuffle } from "react-icons/ti"
import { FaPlay, FaPlus } from 'react-icons/fa'
import { IoIosSkipBackward } from "react-icons/io"
import { FaPause } from "react-icons/fa6"
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { HiOutlineQueueList } from "react-icons/hi2";
import { TbMicrophone2 } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";

function Player() {
    const [shufflePlayer, setShufflePlayer] = useState(false);
    console.log(shufflePlayer);
    const [repeatCount, setRepeatCount] = useState(0);
    const [repeatOn, setRepeatOn] = useState(false);
    const {playerOn, play, stop, toggle, playerImgSrc, changePlayerImage} = useContext(PlayerContext);  
    


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


    const greenShuffle = shufflePlayer ? 'green-shuffle' : '';
    const greenRepeat = repeatOn? 'green-repeat' : '';


  return (
    <div>
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
                            <button className='player-play-button'><span><FaPlay/></span></button>
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
      </div>
    </div>
  )
}

export default Player
