import React from 'react'
import Header from './Header'
import { useState , useEffect, useContext } from 'react';
import LibraryCardGrid from './LibraryCardGrid';
import '../css/Library.css';
import { PlayerContext } from '../contexts/PlayerContext'
import AlbumManagement from './AlbumManagement';
import {projectsStorage} from '../data/projects'
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db, storage } from '../firebase'
import { ReadProjectsFromFirebase } from './AlbumManagement';

function Library({player, playerToggle}) {

  const { getCurrentUserIdString } = useAuth();

  const [hasProjects, setHasProjects] = useState(true);
  const [userCards, setUserCards] = useState([]);
  const [addButtonClicked, setAddButtonClicked] = useState(false);
  const [albumManagerMode, setAlbumManagerMode] = useState(false);
  const [firstCreationSuccessful, setFirstCreationSuccessful] = useState(false);
  const [selectedProjectKey, setSelectedProjectKey] = useState("");
  const [libraryKeyActive, setLibraryKeyActive] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState({
    title: '', 
    label: '[label]', 
    image: '', 
    artist: '',
    date: new Date(), 
    type: {label: 'Single', value: 'Single'},
    songs: '',
    duration: ''
  });

  function displayManager() {
    setAddButtonClicked(true)
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

  useEffect(() => {
    if(firstCreationSuccessful || userCards.length > 0){
      setHasProjects(true)
    }
    else {
      setHasProjects(false)
    }
  }, [firstCreationSuccessful, userCards])

  useEffect(() => {
    ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
      setProjects(result)
      if(result.length > 0){
        console.log("Result TRUE")
        setHasProjects(true)
      }
    });
  }, [])

  useEffect(() => {console.log("CHANGE!", selectedProjectKey); setLibraryKeyActive(true)}, [selectedProjectKey])

  return (
    <div className='page'>
      <Header></Header>
      <div className='library' style={staticStyle}>
        {hasProjects ? (<LibraryCardGrid projects={projects} setProjects={setProjects} player={player} playerValue={playerToggle} userCards={userCards} setUserCards={setUserCards} setSelectedProjectKey={setSelectedProjectKey} setSelectedProject={setSelectedProject}/>) : (

          <div className='noProjectsContainer'>
            <div className="noProjectsContent">
              <h3>You have no music projects yet! Let's get started.</h3>
              <div className='addProjects'>

                <button className='addProjectsBtn' onClick={()=>displayManager()}>Add Music</button>
              </div>
            </div>
          </div>
        )}
        {addButtonClicked && 
          <AlbumManagement projects={projects} setProjects={setProjects} clickOff={setAddButtonClicked} edit={albumManagerMode} setMode={setAlbumManagerMode} cards={userCards} setCards={setUserCards} setFirstCreationSuccessful={setFirstCreationSuccessful} libraryProjectKey={selectedProjectKey} selectedProject={selectedProject}/>
        }
      </div>
    </div>
  )
}

export default Library
