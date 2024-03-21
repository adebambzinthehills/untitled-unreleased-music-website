import React, {useEffect, useContext, useState }from 'react'
import { BsThreeDots } from "react-icons/bs"
import { FaRegEdit } from "react-icons/fa"
import { PlayerContext } from '../contexts/PlayerContext';
import { BsExplicitFill } from "react-icons/bs";
import { CgLoadbarSound } from "react-icons/cg";

import { Draggable } from 'react-beautiful-dnd';


function TracklistSong({number, title, duration, artist, edit, setMode, content, setSelectedSongKey, id, tracks, projectKey}) {

  const {playerOn, play, stop, toggle, setGlobalTrackIndex, setPlayerTracklist, setCurrentlyPlayingProjectKey, setGlobalPlaying, setPlayerUpdated, currentlyPlayingSongKey, setCurrentlyPlayingSongKey} = useContext(PlayerContext);

  return (
    <Draggable key={id} draggableId={id} index={number}>
    {(provided) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style}} >
        <li>
                <div className='row tracklist-row'>
                <button className='tracklist-song-button' onClick={() => {setCurrentlyPlayingProjectKey(projectKey); setPlayerTracklist(tracks); setPlayerUpdated(prev => !prev); play(); setGlobalPlaying(true); setGlobalTrackIndex((number-1)); setCurrentlyPlayingSongKey(id)}}></button>
                  <div className='col-0-5 song-number'>
                    <div className='number-wrapper'> 
                        <span style={currentlyPlayingSongKey == id? {left: '-10px'} : {left: '0px'}}>{currentlyPlayingSongKey == id ? <CgLoadbarSound /> : number}</span>
                    </div>
                  </div>
                  <div className='col-10 col-sm-8 col-md-8 song-information'>
                    <div className='information-wrapper'> 
                        <div className='song-title'>
                            <span style={currentlyPlayingSongKey == id ? {color:'#1ed76b'} : {color:'white'}}>{content.title}</span>
                        </div>
                        <div className='song-artist'>
                            <span>{content.explicit? <BsExplicitFill style={{position:'relative', top:'-1px'}}/> : ''} {content.author}</span>
                        </div>
                    </div>
                  </div>
                  <div className='col-2 col-sm-3 col-md-3 song-functions'>

                    <div className='buttons-wrapper'>
                        <div className='song-time'><span>{content.duration}</span></div>
                        <div className='song-options-button-wrapper'>
                          <button className='song-options-button' onClick={() => {setSelectedSongKey(id); setMode(true); edit(true)}}>
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
    )}
    </Draggable>
  )
}

export default TracklistSong
