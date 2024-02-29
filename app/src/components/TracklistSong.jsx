import React, {useEffect, useContext, useState }from 'react'
import { BsThreeDots } from "react-icons/bs"
import { FaRegEdit } from "react-icons/fa"
import { PlayerContext } from '../contexts/PlayerContext';

function TracklistSong({number, title, duration, artist, edit, setMode, content}) {

  const {playerOn, play, stop, toggle} = useContext(PlayerContext);

  return (
    <div>
      <li className>
        
                <div className='row tracklist-row'>
                <button className='tracklist-song-button' onClick={toggle}></button>
                  <div className='col-0-5 song-number'>
                    <div className='number-wrapper'> 
                        <span>{number}</span>
                    </div>
                  </div>
                  <div className='col song-information'>
                  
                    <div className='information-wrapper'> 
                        <div className='song-title'>
                            <span>{content.title}</span>
                        </div>
                        <div className='song-artist'>
                            <span>[artistname]</span>
                        </div>
                    </div>
                  </div>
                  <div className='col-5 col-sm-4 col-md-3 song-functions'>

                    <div className='buttons-wrapper'>
                        <div className='song-time'><span>{content.duration}</span></div>
                        <div className='song-options-button-wrapper'>
                          <button className='song-options-button'>
                              <span>
                                  <BsThreeDots/>
                              </span>
                          </button>
                        </div>
                        {/* <button className='edit-song-button' onClick={() => {edit(true); setMode(true)}}>
                            <span>
                            <   FaRegEdit/>
                            </span>
                        </button> */}
                    </div>
                  </div>
                </div>
        </li>
    </div>
  )
}

export default TracklistSong
