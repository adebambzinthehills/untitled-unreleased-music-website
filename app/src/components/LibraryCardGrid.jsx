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

function LibraryCardGrid({userCards, setUserCards, projects, setProjects, setSelectedProjectKey, setSelectedProject, setSearchActive}) {
  console.log(projects)

  const [search, setSearch] = useState('');
  const [filteredCards, setFilteredCards] = useState(userCards)
  const [cardsMemory, setCardsMemory] = useState(userCards)
  const [hasSearched, setHasSearched] = useState(false);

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

  useEffect(() => {
    if(projects.length > 0){
      //generate new card
      var tempArray = [];
      for(let i = 0; i < projects.length; i++ ){
        var currentProject = projects[i];
        console.log(currentProject)
        var title = currentProject.projectTitle;
        var artist = currentProject.artist;
        var albumImage = currentProject.image;
        var label = currentProject.label;
        var dateValue = currentProject.date;
        var colour = currentProject.colour;
        var projectTypeChoice = currentProject.projectType
        var songs = Object.keys(currentProject.songs).length;
        var songList = currentProject.songs;
        var key = currentProject.key;

        console.log('@Songs: ', songs);
        console.log("KEy: ", key);

        tempArray = [...tempArray,
          <LibraryCard key={key} id={key} title={title} artist={artist} image={albumImage} type={projectTypeChoice} songs={songs} songList={songList} 
          edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} label={label} date={dateValue} setSelectedProjectKey={setSelectedProjectKey} setSelectedProject={setSelectedProject}></LibraryCard>
        ];
        // console.log('Temp', tempArray[0].props.title)
      }
      setUserCards(tempArray)

    }
  }, [])

  function handleSearch(value) { 
    setSearch(value)
    setHasSearched(true)
  }

  useEffect(() => {
    const filteredItems = projects.filter((project) => project.projectTitle.toLocaleLowerCase().includes(search.toLocaleLowerCase().trim()))
    console.log(filteredItems)
    
    if(filteredItems.length > 0){
      var tempArray = [];
      for(let i = 0; i < filteredItems.length; i++ ){
        var currentProject = filteredItems[i];
        console.log(currentProject)
        var title = currentProject.projectTitle;
        var artist = currentProject.artist;
        var albumImage = currentProject.image;
        var label = currentProject.label;
        var dateValue = currentProject.date;
        var colour = currentProject.colour;
        var projectTypeChoice = currentProject.projectType
        var songs = Object.keys(currentProject.songs).length;
        var songList = currentProject.songs;
        var key = currentProject.key;

        console.log('@Songs: ', songs);
        console.log("KEy: ", key);

        tempArray = [...tempArray,
          <LibraryCard key={key} id={key} title={title} artist={artist} image={albumImage} type={projectTypeChoice} songs={songs} songList={songList} 
          edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} label={label} date={dateValue} setSelectedProjectKey={setSelectedProjectKey} setSelectedProject={setSelectedProject}></LibraryCard>
        ];
        // console.log('Temp', tempArray[0].props.title)
        setSearchActive(true)
        setUserCards(tempArray)
        setCardsMemory(tempArray)
      }
    }
    else {
      setUserCards([])

      if(search.trim() == ""){
        setSearchActive(false)
        setHasSearched(false)
        setUserCards(cardsMemory)
      }
    }
  }, [search])

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
            <input className='search-bar' placeholder='search for a single, ep or a project here...' value={search} onChange={(e) => handleSearch(e.target.value)}></input>
          </div>
          { false && <div className='search-bar-row'>
            <button>Albums</button>
            <button>Playlists</button>
          </div>}
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
      <AlbumManagement projects={projects} setProjects={setProjects} clickOff={setNewProjectButtonClicked} edit={albumManagerMode} setMode={setAlbumManagerMode} cards={userCards} setCards={setUserCards}/>
      }
    </div>
  )
}

export default LibraryCardGrid
