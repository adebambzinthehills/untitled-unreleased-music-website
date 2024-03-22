import React, { useEffect } from 'react'
import { useState, useContext} from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { CiFolderOn } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { PlayerContext } from '../contexts/PlayerContext';
import { IoMdPause } from 'react-icons/io';
import { Draggable } from 'react-beautiful-dnd';

function LibraryCard({id, title, artist, image, type, songs, edit, setMode, date, label, songList, setSelectedProjectKey, setSelectedProject, number}) {

  const [buttonClick, setButtonClicked] = useState(false);
  const [editButtonClicked, setEditButtonClicked] = useState(false);

  const {playerTracklist, setPlayerTracks, setPlayerTracklist} = useContext(PlayerContext); 

  const navigate = useNavigate();

  const {playerOn, play, stop, toggle, setGlobalPlaying, globalPlaying, currentlyPlayingProjectKey, setCurrentlyPlayingProjectKey} = useContext(PlayerContext);

  function cardClickHandler(){
    console.log(id, image, title, songs, type, artist, setMode, date, label);
    var path = '/project/' + id;
    console.log(path)
    navigate(path, { state : {image: image, title: title, artist: artist, type: type, songs: songs, date: date, label: label}});
  }

  function handleCardPlay(){
    if(songList.length > 0){
      console.log("SONG LIST!", songList)
      setPlayerTracklist(songList);
      play();
      setGlobalPlaying(prev => !prev); 
      setCurrentlyPlayingProjectKey(id);
    }
    else {
      alert("There are no songs to play!");
    }
  }

  function handleEditPress() {

    setSelectedProjectKey(id); edit(true); setMode(true)
  }


  return (
    <Draggable key={id} draggableId={id} index={number}>
    {(provided) => (
    <div className='card-container grid-item' ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{...provided.draggableProps.style}}>
      <div className='card-click'>
        <button className='card-click-button' onClick={() => cardClickHandler()}></button>
      </div>
      <div className="card-header" onMouseLeave={() => setButtonClicked(false)}> 
        <div className='card-header-block-wrapper' style={{height: '10px'}}>
          <div className='card-header-button'>
          {  false && <button  onClick={() => {console.log(id); setSelectedProjectKey(id); setButtonClicked(!buttonClick)}}>
                <BsThreeDots/>
            </button>}
          </div>
          {buttonClick && (
          <div className='card-header-sub-menu' onMouseLeave={() => setButtonClicked(false)}>
            <ul>
              <li><button onClick={() => handleEditPress()}><span><FaRegEdit></FaRegEdit></span> Edit Album</button></li>
              <li><button disabled><span><CiFolderOn></CiFolderOn></span> Move to Folder</button></li>
              <li><button><span><FaRegTrashCan></FaRegTrashCan></span> Delete Album</button></li>
            </ul>
          </div>
          )}
        </div>
      </div>
      <div className='card-image-wrapper'>
        <img className="card-image" src={image}></img>
      </div>
      <div className='card-contents'>
        <a href="#">
            <div>
                <h5>{title}</h5>
            </div>
        </a>
        <p>{date[2]} • {type.value} </p>
      </div>
      <div className='card-play-content'>
        {/* absolute position, floating right, border radius 500, z index 2 */}
        <button className='card-play-button' onClick={() => {handleCardPlay()}} ><span>{globalPlaying && id == currentlyPlayingProjectKey ? (<IoMdPause className='pause'/>):(<FaPlay/>)}</span></button>
      </div>
    </div>
    )}
    </Draggable>
  )
}

export default LibraryCard
