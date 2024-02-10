import React, { useState } from 'react'
import TracklistSong from './TracklistSong';

function Tracklist({songs, artist, player, edit, setMode}) {
  const [songNumber, setSongNumber] = useState(songs);
  let tracklist = [];

  for (let i = 1; i < songNumber + 1; i++ ){
    tracklist.push(<TracklistSong key={i} number={i} player={player} edit={edit} setMode={setMode}/>);
  }

  return (
    <div className='tracklist'>
      <div className='container'>
        <div className='tracklist-wrapper'>
          <ul className>
            {tracklist}
          </ul> 
        </div>
      </div>
    </div>
  )
}

export default Tracklist
