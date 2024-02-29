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
import teenweek from '../images/teenweek.jpg'


import { FaPlus } from "react-icons/fa";
import likedsongs from "../images/liked-songs.jpeg";
import { MdCreateNewFolder } from "react-icons/md";

import { useState } from 'react';
import { PlayerContext } from '../contexts/PlayerContext'
import AlbumManagement from './AlbumManagement'

import "../css/App.css"

function LibraryCardGrid({userCards, setUserCards}) {
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [newProjectButtonClicked, setNewProjectButtonClicked] = useState(false);
  const [albumManagerMode, setAlbumManagerMode] = useState(false)
  const [makeElementsStatic, setMakeElementsStatic] = useState(false);
  const staticStyle = makeElementsStatic ? {position: 'static'} : {position: 'relative'};
  const footerStaticStyle = makeElementsStatic ? {position: 'static'} : {position: 'fixed'};

  const {playerOn, play, stop, toggle, fullscreenPlayerEnabled} = useContext(PlayerContext);

  useEffect(() => {
    if(playerOn){
      document.getElementsByClassName('library-footer')[0].style.bottom = '110px';
    }
    else{
      document.getElementsByClassName('library-footer')[0].style.bottom = '40px';
    }
    console.log(playerOn)
  }, [playerOn]);

  useEffect(() => {
    if(fullscreenPlayerEnabled){
      setMakeElementsStatic(true);
    }
    else {
      setMakeElementsStatic(false)
    }
  }, [fullscreenPlayerEnabled]);

  useEffect(() => {
    if(newProjectButtonClicked){
      document.body.style.overflow = 'hidden';
    }
    else{
      document.body.style.overflow = 'unset';
    }
  }, [newProjectButtonClicked])


  const [gridHeightOver, setGridHeightOver] = useState(false);
  useEffect(() => {
    let gridHeight = document.body.getElementsByClassName('grid-card-container')[0].clientHeight;
    console.log(gridHeight);
    if(gridHeight > 400){
      setGridHeightOver(true);
    }
  }, [])
  useEffect(() => {
    let gridHeight = document.body.getElementsByClassName('grid-card-container')[0].clientHeight;
    console.log(gridHeight);
    if(gridHeight > 400){
      setGridHeightOver(true);
    }
  }, [gridHeightOver])

  const exampleCards = [
  <LibraryCard title="CTV3: Day Tripper's Edition" artist="Jaden" image={ctv3} type="Album" songs={2} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="CTV3: Cool Tape Vol. 3" artist="Jaden" image={ctv30} type="Album" songs={3} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="ERYS (Deluxe)" artist="Jaden" image={erys} type="Album" songs={3} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="SYRE" artist="Jaden" image={syre} type="Album" songs={3} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="Wallsocket" artist="underscores" image={wallsocket} type="Album" songs={10} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="fishmonger" artist="underscores" image={fishmonger} type="Album" songs={3} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} ></LibraryCard>,
  <LibraryCard title="to hell with it" artist="PinkPantheress" image={tohellwithit} type="Album" songs={10} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="What Could Possibly Go Wrong" artist="Dominic Fike" image={wcpgw} type="Album" songs={14} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="Sunburn" artist="Dominic Fike" image={sunburn} type="Album" songs={5} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="GUTS" artist="Olivia Rodrigo" image={guts} type="Album" songs={5} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="Teen Week" artist="Jane Remover" image={teenweek} type="Album" songs={4} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode}></LibraryCard>,
  <LibraryCard title="All Songs" artist="[artistname]" image={likedsongs} type="Playlist" songs={30}></LibraryCard>
  ];

  return (
    <div className='libraryWrapper' style={staticStyle}>
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
        {userCards.length > 0 ? userCards : ''}
      </div>
      {gridHeightOver && <div className='footer-block'></div>}  
      {playerOn && <div className='player-block'></div>}
      <div className='library-footer' style={footerStaticStyle}>
        <div className='library-footer-content' >
          <div className='footer-block-wrapper' onMouseLeave={() => setAddButtonClicked(false)}>
            {addButtonClicked && (
            <div className='library-footer-sub-menu'>
              <ul>
                <li><button onClick={() => {setNewProjectButtonClicked(true);}}><span><MdCreateNewFolder/></span> New Project</button></li>
              </ul>
            </div>
            )}
            <div>
              <button className='library-footer-button' onClick={() => setAddButtonClicked(!addButtonClicked)}><span><FaPlus/></span>  Add</button>
            </div>
          </div>
        </div>
        {/* {playerOn && <Player></Player>} */}
      </div>
      {newProjectButtonClicked &&
      <AlbumManagement clickOff={setNewProjectButtonClicked} edit={albumManagerMode} setMode={setAlbumManagerMode} cards={userCards} setCards={setUserCards}/>
      }
    </div>
  )
}

export default LibraryCardGrid
