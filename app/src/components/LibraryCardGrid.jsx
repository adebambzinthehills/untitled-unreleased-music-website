import React, { useContext, useEffect } from 'react'
import LibraryCard from './LibraryCard'
import Player from './Player'

import ctv3 from '../images/ctv3.jpeg'
import ctv30 from '../images/ctv301.jpeg'
import erys from '../images/erys.webp'
import syre from '../images/syre.jpeg'
import wallsocket from '../images/wallsocket.jpeg'
import fishmonger from '../images/fishmonger.jpg'
import wcpgw from '../images/df1.webp'
import sunburn from '../images/df2.webp'
import tohellwithit from '../images/pp1.jpeg';
import guts from '../images/guts.webp'


import { FaPlus } from "react-icons/fa";
import likedsongs from "../images/liked-songs.jpeg";
import { MdCreateNewFolder } from "react-icons/md";

import { useState } from 'react';
import { PlayerContext } from '../contexts/PlayerContext'



function LibraryCardGrid() {
  const [addButtonClicked, setAddButtonClicked] = useState(false);

  const {playerOn, play, stop, toggle} = useContext(PlayerContext);

  useEffect(() => {
    if(playerOn){
      document.getElementsByClassName('library-footer')[0].style.bottom = '110px';
    }
    else{
      document.getElementsByClassName('library-footer')[0].style.bottom = '40px';
    }
    console.log(playerOn)
  }, [playerOn]);

  return (
    <div className='libraryWrapper'>
      <div className='search-bar-wrapper container'>
        <div className='library-search-bar-content'>
          <div className='search-bar-item'>
            <input className='search-bar' placeholder='Search for an song, album or playlist here.'></input>
          </div>
          <div className='search-bar-row'>
            <button>Albums</button>
            <button>Playlists</button>
          </div>
        </div>
        <div className='library-search-bar-block'></div>
      </div>
      <div className='grid-card-container'>
        <LibraryCard title="CTV3: Day Tripper's Edition" artist="Jaden" image={ctv3} type="Album" songs={2}></LibraryCard>
        <LibraryCard title="CTV3: Cool Tape Vol. 3" artist="Jaden" image={ctv30} type="Album" songs={3}></LibraryCard>
        <LibraryCard title="ERYS (Deluxe)" artist="Jaden" image={erys} type="Album" songs={3}></LibraryCard>
        <LibraryCard title="SYRE" artist="Jaden" image={syre} type="Album" songs={3}></LibraryCard>
        <LibraryCard title="Wallsocket" artist="underscores" image={wallsocket} type="Album" songs={10}></LibraryCard>
        <LibraryCard title="fishmonger" artist="underscores" image={fishmonger} type="Album" songs={3}></LibraryCard>
        <LibraryCard title="to hell with it" artist="PinkPantheress" image={tohellwithit} type="Album" songs={10}></LibraryCard>
        <LibraryCard title="What Could Possibly Go Wrong" artist="Dominic Fike" image={wcpgw} type="Album" songs={14}></LibraryCard>
        <LibraryCard title="Sunburn" artist="Dominic Fike" image={sunburn} type="Album" songs={5}></LibraryCard>
        <LibraryCard title="GUTS" artist="Olivia Rodrigo" image={guts} type="Album" songs={5}></LibraryCard>
        <LibraryCard title="All Songs" artist="[artistname]" image={likedsongs} type="Playlist"></LibraryCard>
      </div>

      {playerOn && <div className='player-block'></div>}
      <div className='library-footer'>
        <div className='library-footer-content' >
          <div className='footer-block-wrapper' onMouseLeave={() => setAddButtonClicked(false)}>
            {addButtonClicked && (
            <div className='library-footer-sub-menu'>
              <ul>
                <li><button><span><MdCreateNewFolder/></span> New Project</button></li>
              </ul>
            </div>
            )}
            <div>
              <button className='library-footer-button' onClick={() => setAddButtonClicked(!addButtonClicked)}><span><FaPlus/></span>  Add</button>
            </div>
          </div>
        </div>
        {playerOn && <Player></Player>}
      </div>
    </div>
  )
}

export default LibraryCardGrid
