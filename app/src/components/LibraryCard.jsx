import React from 'react'
import { useState } from 'react';



function LibraryCard({title, artist, image, type}) {

  return (
    <div className='card-container grid-item'>
      <div classHeader="card-header"> 
        
      </div>
      <div className='card-image-wrapper'>
        <img className="card-image" src={image}></img>
      </div>
      <div className='card-contents'>
        <div>
            <h5>{title}</h5>
        </div>
        <p>{artist}</p>
        <p>{type}</p>
      </div>
    </div>
  )
}

export default LibraryCard
