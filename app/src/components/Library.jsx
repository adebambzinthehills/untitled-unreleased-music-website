import React from 'react'
import Header from './Header'
import { useState , useEffect, useContext } from 'react';
import LibraryCardGrid from './LibraryCardGrid';
import '../css/Library.css';
import { PlayerContext } from '../contexts/PlayerContext'

function Library({player, playerToggle}) {

  const [hasProjects, setHasProjects] = useState(true);

  function dummyHandle() {
    setHasProjects(true);
  }

  const [makeElementsStatic, setMakeElementsStatic] = useState(false);
  const staticStyle = makeElementsStatic ? {position: 'static'} : {position: 'relative'};
  const {fullscreenPlayerEnabled} = useContext(PlayerContext);

  useEffect(() => {
    if(fullscreenPlayerEnabled){
      setMakeElementsStatic(true);
    }
    else {
      setMakeElementsStatic(false)
    }
  }, [fullscreenPlayerEnabled]);

  return (
    <div className='page'>
      <Header></Header>
      <div className='library' style={staticStyle}>
        {hasProjects ? (<LibraryCardGrid player={player} playerValue={playerToggle}/>) : (

          <div className='noProjectsContainer'>
            <div className="noProjectsContent">
              <h3>You have no music projects yet! Let's get started.</h3>
              <div className='addProjects'>

                <button className='addProjectsBtn' onClick={()=>dummyHandle()}>Add Music</button>
              </div>
            </div>
          </div>
        
        )}
      </div>
    </div>
  )
}

export default Library
