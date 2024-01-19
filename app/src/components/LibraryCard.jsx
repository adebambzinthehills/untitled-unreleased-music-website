import React from 'react'
import { useState } from 'react';
import { BsThreeDots } from "react-icons/bs";
import { FaPlay } from "react-icons/fa";




function LibraryCard({title, artist, image, type}) {

  return (
    <div className='card-container grid-item'>
      <div className='card-click'>
        <button className='card-click-button'></button>
      </div>
      <div className="card-header"> 
        <button>
            <BsThreeDots/>
        </button>
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
