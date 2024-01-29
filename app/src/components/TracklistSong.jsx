import React from 'react'
import { BsThreeDots } from "react-icons/bs"
import { FaRegEdit } from "react-icons/fa"

function TracklistSong({number, title, duration, artist, player}) {

  function play(){
    player(true);
  }

  return (
    <div>
      <li className>
            <button className='tracklist-song-button' onClick={() => play()}>
                <div className='row'>
                  <div className='col-0-5 song-number'>
                    <div className='number-wrapper'> 
                        <span>{number}</span>
                    </div>
                  </div>
                  <div className='col song-information'>
                    <div className='information-wrapper'> 
                        <div className='song-title'>
                            <span>Circa 2013</span>
                        </div>
                        <div className='song-artist'>
                            <span>{artist} Jaden</span>
                        </div>
                    </div>
                  </div>
                  <div className='col-5 col-sm-4 col-md-3 song-functions'>

                    <div className='buttons-wrapper'>
                        <span className='song-time'>2:02</span>
                        <button className='song-options-button'>
                            <span>
                                <BsThreeDots/>
                            </span>
                        </button>
                        <button className='edit-song-button'>
                            <span>
                            <   FaRegEdit/>
                            </span>
                        </button>
                    </div>
                  </div>

                </div>
            </button>
        </li>
    </div>
  )
}

export default TracklistSong
