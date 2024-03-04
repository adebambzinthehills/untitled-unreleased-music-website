import React, { useState, useEffect } from 'react'
import TracklistSong from './TracklistSong';

function Tracklist({songs, artist, player, edit, setMode, tracks}) {
  const [songNumber, setSongNumber] = useState(tracks.length);
  const [tracklist, setTracklist] = useState([]);

  useEffect(() => {
    console.log("Tracks in Tracklist!: ", tracks)
    let tempTracklist = []
    for (let i = 1; i < tracks.length + 1; i++ ){
      tempTracklist.push( <TracklistSong key={i} number={i} player={player} edit={edit} setMode={setMode} content={tracks[i-1]}/>)
    }
    setTracklist(tempTracklist);
    console.log(tracklist)
    console.log('Re-rendering tracklist!')
  }, [tracks]);

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
