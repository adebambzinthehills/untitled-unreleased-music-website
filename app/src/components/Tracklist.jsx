import React, { useState, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import TracklistSong from './TracklistSong';

function Tracklist({songs, artist, player, edit, setMode, tracks, setTracks, setTracksReordered, setTracksReorderedIndex, setSelectedSongKey, projectKey}) {
  const [songNumber, setSongNumber] = useState(tracks.length);
  const [tracklist, setTracklist] = useState([]);

  //generate new tracklist song elements based on tracks, does so with every update
  useEffect(() => {
    console.log("Tracks in Tracklist!: ", tracks)
    let tempTracklist = []
    for (let i = 1; i < tracks.length + 1; i++ ){
      tempTracklist.push(
            <TracklistSong projectKey={projectKey} tracks={tracks} id={tracks[i-1].key} 
            key={i} number={i} player={player} edit={edit} setMode={setMode} content={tracks[i-1]} 
            setSelectedSongKey={setSelectedSongKey}/>
      );
    }
    setTracklist(tempTracklist);
    console.log(tracklist)
    console.log('Re-rendering tracklist!')
  }, [tracks]);

  
  //handle drag and drop functionality
  function handleOnDropEnd(result) {
    console.log(result.source.index)
    console.log("Drag end!")
    if (!result.destination) return;

    var items = Array.from(tracks);
    console.log(items)
    
    const [reorderedItem] = items.splice(result.source.index - 1, 1);
    console.log(reorderedItem)
    items.splice(result.destination.index - 1 , 0, reorderedItem);

    items = items.filter((element) => {
      return element !== undefined
    });
    console.log(items)

    setTracks(items);
    setTracksReordered(true)
    setTracksReorderedIndex(result.destination.index - 1)

  }

  return (
    <div className='tracklist'>
      <div className='container'>
        <div className='tracklist-wrapper'>
          <DragDropContext onDragEnd={handleOnDropEnd}>
            <Droppable droppableId='tracklist'>
              {(provided) => (
              <ul className='tracklist' ref={provided.innerRef} {...provided.droppableProps}>
                {tracklist}
                {provided.placeholder}
              </ul>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  )
}

export default Tracklist
