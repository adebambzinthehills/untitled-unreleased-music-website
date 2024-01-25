import React from 'react'
import LibraryCard from './LibraryCard'
import ctv3 from '../images/ctv3.jpeg'
import ctv30 from '../images/ctv301.jpeg'
import erys from '../images/erys.webp'
import syre from '../images/syre.jpeg'
import { FaPlus } from "react-icons/fa";
import likedsongs from "../images/liked-songs.jpeg";
import { MdCreateNewFolder } from "react-icons/md";

import { useState } from 'react';



function LibraryCardGrid() {
  const [addButtonClicked, setAddButtonClicked] = useState(false);

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
        <LibraryCard title="CTV3: Day Tripper's Edition" artist="Jaden" image={ctv3} type="Album"></LibraryCard>
        <LibraryCard title="CTV3: Cool Tape Vol. 3" artist="Jaden" image={ctv30} type="Album"></LibraryCard>
        <LibraryCard title="ERYS (Deluxe)" artist="Jaden" image={erys} type="Album"></LibraryCard>
        <LibraryCard title="SYRE" artist="Jaden" image={syre} type="Album"></LibraryCard>
        <LibraryCard title="All Songs" artist="[artistname]" image={likedsongs} type="Playlist"></LibraryCard>
      </div>
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
      </div>
    </div>
  )
}

export default LibraryCardGrid
