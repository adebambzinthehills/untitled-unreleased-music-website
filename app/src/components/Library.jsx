import React from 'react'
import Header from './Header'
import { useState } from 'react';
import LibraryCardGrid from './LibraryCardGrid';
import '../css/Library.css';

function Library() {

  const [hasProjects, setHasProjects] = useState(false);

  function dummyHandle() {
    setHasProjects(true);
  }


  return (
    <div className='page'>
      <Header></Header>
      <div className='library'>
        {hasProjects ? (<LibraryCardGrid/>) : (

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
