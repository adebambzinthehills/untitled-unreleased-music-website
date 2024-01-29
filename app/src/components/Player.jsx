import React, {useContext}from 'react'
import '../css/Player.css'
import { PlayerContext } from '../contexts/PlayerContext';

function Player() {
    const {playerOn, play, stop, toggle, playerImgSrc, changePlayerImage} = useContext(PlayerContext);  

  return (
    <div>
      <div className='player-container'>
        <div className='row player-row'>
            <div className='col-4 player-col'>
                <div className='left-information-wrapper'>
                    <div className='player-image-wrapper'>
                        <button className='player-image-button'><img className='player-image' src={playerImgSrc}></img></button>
                    </div>
                    <div className='player-song-information-wrapper'>
                        <div>
                            <span><a>random song title</a></span>
                        </div>
                        <div>
                            <span>random artist</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-4'></div>
            <div className='col-4'></div>
        </div>
      </div>
    </div>
  )
}

export default Player
