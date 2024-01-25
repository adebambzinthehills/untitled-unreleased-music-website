import React from 'react'
import { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { CiFolderOn } from "react-icons/ci";
import { FaRegTrashCan } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

function LibraryCard({title, artist, image, type}) {

  const [buttonClick, setButtonClicked] = useState(false);
  const navigate = useNavigate();

  function cardClickHandler(){
    navigate('/album', { state : {image: image, title: title, artist: artist, type: type}});
  }

  return (
    <div className='card-container grid-item'>
      <div className='card-click'>
        <button className='card-click-button' onClick={() => cardClickHandler()}></button>
      </div>
      <div className="card-header" onMouseLeave={() => setButtonClicked(false)}> 
        <div className='card-header-block-wrapper'>
          <div className='card-header-button'>
            <button onClick={() => setButtonClicked(!buttonClick)}>
                <BsThreeDots/>
            </button>
          </div>
          {buttonClick && (
          <div className='card-header-sub-menu' onMouseLeave={() => setButtonClicked(false)}>
            <ul>
              <li><button><span><FaRegEdit></FaRegEdit></span> Edit Album</button></li>
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
        <p>{type} • {artist} </p>
      </div>
      <div className='card-play-content'>
        {/* absolute position, floating right, border radius 500, z index 2 */}
        <button className='card-play-button'><span><FaPlay/></span></button>
      </div>
    </div>
  )
}

export default LibraryCard
