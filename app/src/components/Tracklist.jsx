import React, { useState, useEffect } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'

import TracklistSong from './TracklistSong';

function Tracklist({songs, artist, player, edit, setMode, tracks, setTracks, setTracksReordered, setTracksReorderedIndex, setSelectedSongKey, projectKey}) {
  const [songNumber, setSongNumber] = useState(tracks.length);
  const [tracklist, setTracklist] = useState([]);

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

  
  // const onDragEnd = useCallback(() => {
  //   // the only one that is required
  // }, []);
  function handleOnDropEnd(result) {
    console.log(result.source.index)
    console.log("Drag end!")
    if (!result.destination) return;

    var items = Array.from(tracks);
    console.log(items)
    // const tracklistItems = Array.from(tracklist)
    const [reorderedItem] = items.splice(result.source.index - 1, 1);
    console.log(reorderedItem)
    // const [reorderedTracklistItem] = tracklistItems.splice(result.source.index, 1);
    items.splice(result.destination.index - 1 , 0, reorderedItem);

    items = items.filter((element) => {
      return element !== undefined
    });
    console.log(items)
    // tracklistItems.splice(result.destination.index, 0, reorderedTracklistItem);

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
