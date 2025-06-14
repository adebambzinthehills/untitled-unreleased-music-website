import React, { useRef, useState, useEffect } from 'react'
import { ImCross } from 'react-icons/im'
import { MdAddPhotoAlternate } from 'react-icons/md'
import { FaTrashAlt } from 'react-icons/fa'
import { ReadProjectsFromFirebase } from './AlbumManagement';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';


function SongManagement({clickOff, editClickOff, editMode, setMode, edit, tracks, setTracks, setProjects, projectKey, currentProject, setProject, selectedSongKey}) {

    const {getCurrentUserIdString } = useAuth()
    const currentUser = getCurrentUserIdString();

    async function writeProjectsToFirebase(projects){
        var currentUser = getCurrentUserIdString();
        await setDoc(doc(db, "users", currentUser), {projects});
        ReadProjectsFromFirebase(currentUser).then((res) => setProjects(res))
    }

    const [song, setSong] = useState(null);
    const songTitle = useRef();
    const explicitTag = useRef();
    const [explicitChecked, setExplicitChecked] = useState(false);
    const file = useRef();

    //click file input manually.
    function handleClick() {
        const input = document.getElementById('insertSong');
        input.click();
    }

    //display file name
    function handleInputDisplay() {
        const input = document.getElementById('insertSong');
        input.style.display = 'block';

        if(input.value == null || input.value == "" ){
            input.style.display = 'none';
        }
    }

    function formatTime(time){
        if (time && !isNaN(time)) {
          const minutes = Math.floor(time / 60);
          const formatMinutes =
            minutes < 10 ? `0${minutes}` : `${minutes}`;
          const seconds = Math.floor(time % 60);
          const formatSeconds =
            seconds < 10 ? `0${seconds}` : `${seconds}`;
          return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };

    //load information if on edit mode

    useEffect(() => {
        if(editMode){
            let currentTrack = [];
            console.log(`State key: `, selectedSongKey);
            for(let i = 0; i < tracks.length; i++){
                if(tracks[i].key == selectedSongKey){
                    currentTrack = tracks[i];
                }
                console.log(`Tracks[${i}] key: `, tracks[i].key);
            }
            songTitle.current.value = currentTrack.title;
            setExplicitChecked(currentTrack.explicit)
        }
    }, [selectedSongKey]);

    //add new song, upload information to database

    function handleSongManager(){

        let title = "New Song #" + (tracks.length + 1);
        let allowCreation = true;
        let musicURL = "";
        let duration = "";

        if(songTitle.current.value != null && songTitle.current.value.trim(" ") != ""){
            title = songTitle.current.value;
        }

        if(file.current.files[0] != null){
            musicURL = URL.createObjectURL(file.current.files[0]);
            var audio = document.createElement('audio');
            audio.src = musicURL;
            console.log("HEY!")

            audio.onloadedmetadata = function(){
                duration = audio.duration;
                let songKey;
                if(!editMode){
                    songKey = Math.floor(Math.random() * Date.now()).toString(36)
                }
                else {
                    songKey = selectedSongKey;
                }
                
                let path = `${getCurrentUserIdString()}/${projectKey}/${songKey}/${file.current.files[0].name}`

                const storage = getStorage();
                const storageRef = ref(storage, path);

                const metadata = {
                    contentType: "audio/mpeg"
                }

                console.log(musicURL);

                console.log(storageRef.fullPath);
                console.log("HEY!")

                if(allowCreation){
                    uploadBytes(storageRef, file.current.files[0], metadata).then((snapshot) => {
                        console.log("Hey! I just uploaded a file to my storage!")
                        console.log("HEY!")
                        getDownloadURL(storageRef).then((url) => {
                                ReadProjectsFromFirebase(currentUser).then((result) => {
                                    let tempProjects = [];
                                    let currentProjects = result;
                                    for(let i = 0; i < currentProjects.length; i++){
                                        let project = currentProjects[i];
                                        console.log(project.key)
                                        console.log(projectKey)

                                        
                                        if(project.key == projectKey){
                                            console.log("Keys same!")
                                            let tempTracks = []

                                            if(editMode){
                                                for(let i = 0; i < tracks.length; i++){
                                                    if(tracks[i].key == selectedSongKey){
                                                        tempTracks.push(
                                                            {
                                                                key: songKey, 
                                                                title: title, 
                                                                src: url, 
                                                                duration: formatTime(duration), 
                                                                unformattedDuration: duration, 
                                                                thumbnail: project.image, 
                                                                album: project.projectTitle, 
                                                                author: project.artist,
                                                                path: path,
                                                                explicit: explicitChecked,
                                                                colour: project.colour
                                                            });
                                                    }
                                                    else{
                                                        tempTracks.push(tracks[i]);
                                                    }
                                                }
                                            }
                                            else{
                                                tempTracks = [...tracks, 
                                                    {
                                                        key: songKey, 
                                                        title: title, 
                                                        src: url, 
                                                        duration: formatTime(duration),
                                                        unformattedDuration: duration, 
                                                        thumbnail: project.image, 
                                                        album: project.projectTitle, 
                                                        author: project.artist,
                                                        path: path,
                                                        explicit: explicitChecked,
                                                        colour: project.colour
                                                    }
                                                ]
                                            }
                                            let updatedProject = project;
                                            updatedProject.songs = tempTracks;
            
                                            setProject(updatedProject);
                                            tempProjects.push(updatedProject);
                                            console.log("Updated project values (songs): ", updatedProject);
                                        }
                                        else{
                                            tempProjects.push(currentProjects[i])
                                        }
                                    }
            
                                    console.log('Updated Projects (Song Change)! : ', tempProjects);
                                    setProjects(tempProjects);
                                    writeProjectsToFirebase(tempProjects)
                                });
            
                                clickOff(false); editClickOff(false); setMode(false)
                            
                        })
                
                    })
                }
            }
        }
        else if (editMode) {
            ReadProjectsFromFirebase(currentUser).then((result) => {
                let tempProjects = [];
                let currentProjects = result;
                for(let i = 0; i < currentProjects.length; i++){
                    let project = currentProjects[i];
                    console.log(project.key)
                    console.log(projectKey)

                    let currentTrackSrc = "";
                    let currentTrackDuration = "";
                    let currentUnformattedTrackDuration = "";
                    let currentTrackPath = "";
                    console.log(`State key: `, selectedSongKey);
                    let tempTracks = []
                    for(let i = 0; i < tracks.length; i++){
                        if(tracks[i].key == selectedSongKey){
                            currentTrackSrc = tracks[i].src;
                            currentTrackDuration = tracks[i].duration;
                            currentUnformattedTrackDuration = tracks[i].unformattedDuration;
                            currentTrackPath =  tracks[i].path;
                            tempTracks.push(
                                {
                                    key: selectedSongKey, 
                                    title: title, 
                                    src: currentTrackSrc, 
                                    duration: currentTrackDuration, 
                                    unformattedDuration: currentUnformattedTrackDuration, 
                                    thumbnail: project.image, 
                                    album: project.projectTitle, 
                                    author: project.artist,
                                    path: currentTrackPath,
                                    explicit: explicitChecked,
                                    colour: project.colour
                                });
                        }
                        else{
                            tempTracks.push(tracks[i]);
                        }
                    }
                    if(project.key == projectKey){
                        let updatedProject = project;
                        updatedProject.songs = tempTracks

                        setProject(updatedProject);
                        tempProjects.push(updatedProject);
                        console.log("Updated project values (songs): ", updatedProject);
                    }
                    else{
                        tempProjects.push(currentProjects[i])
                    }
                }

                console.log('Updated Projects (Song Change)! : ', tempProjects);
                setProjects(tempProjects);
                writeProjectsToFirebase(tempProjects)

                

                clickOff(false); editClickOff(false); setMode(false)
            });
        }
        else {
            allowCreation = false
        }

        if(!allowCreation) {
            alert("#NAH!")
        }
        

    }

    //delete song information from firebase storage and from firestore
    function deleteSong() {
        if(window.confirm("Are you sure you want to delete this track?")){
            ReadProjectsFromFirebase(currentUser).then((result) => {
                let tempProjects = [];
                let currentProjects = result;
                let deletePath = ""

                for(let i = 0; i < currentProjects.length; i++){
                    let project = currentProjects[i];

                    let currentTrackSrc = "";
                    let currentTrackDuration = "";
                    let currentUnformattedTrackDuration = "";
                    let tempTracks = [];
                    for(let i = 0; i < tracks.length; i++){
                        if(!(tracks[i].key == selectedSongKey)){
                            tempTracks.push(tracks[i]);
                        }
                        else {
                            deletePath = tracks[i].path;
                        }
                    }
                    if(project.key == projectKey){
                        let updatedProject = project;
                        updatedProject.songs = tempTracks

                        setTracks(tempTracks)
                        setProject(updatedProject);
                        tempProjects.push(updatedProject);
                        console.log("Updated project values (removed songs): ", updatedProject);
                    }
                    else{
                        tempProjects.push(currentProjects[i])
                    }
                }

                console.log('Updated Projects (Song Change)! : ', tempProjects);
                setProjects(tempProjects);
                writeProjectsToFirebase(tempProjects)
                const storage = getStorage();
                const storageRef = ref(storage, deletePath);

                deleteObject(storageRef).then(() => {
                    console.log("Hooray! My reference has been deleted [ADMIN]")
                }).catch((error) => {
                    console.log("Error deleting the database entry in Firebase! [ADMIN]")
                })

                clickOff(false); editClickOff(false); setMode(false)
            });
        }
    }

    return (
        <div className='song-manager-wrapper'>
            <div className='album-manager-click-off' onClick={() => {clickOff(false); editClickOff(false); setMode(false)}}></div>
            <div className='song-manager'>
                <div className='song-manager-header-wrapper'>
                    <div className='song-manager-header'>
                        <h4>{editMode ? 'Edit' : 'Add'} Track</h4>
                    </div>
                    <div className='song-manager-header-button-wrapper'>
                        <button className='song-manager-header-button' onClick={() => {clickOff(false); editClickOff(false); setMode(false)}}><span><ImCross/></span></button>
                    </div>
                </div>
                <div className='song-manager-content'>
                    {/* <div className='album-manager-image-wrapper'>
                        <div className='album-manager-image-content'>
                            <div className='hover-information'>
                                <div>
                                    <div className='hover-unit-wrapper'>
                                        <div className='hover-icon'><span><MdAddPhotoAlternate/></span></div>
                                    </div>
                                    <div className='hover-unit-wrapper'>
                                        <div className='hover-text'><span>Choose photo</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className='album-manager-image'>
                                <img/>
                            </div>
                            <input className="management-input" type="file" accept='image/jpg, image/png, image/jpeg, image/webp'/>
                            <div className='management-input-click-div'>
                                <button className='management-input-button' onClick={() => {clickOff(false); handleClick(); setMode(false)}}></button>
                            </div>
                        </div>
                    </div> */}
                    <div className='song-manager-entry-wrapper'>
                        <div className='song-manager-entry-content'>
                            <div className='song-manager-field-wrapper'>
                                <div className='label-wrapper'><label htmlFor="">Song Title</label></div>
                                <input className='song-entry' ref={songTitle} placeholder="What's your song title?" type="text"></input>
                            </div>
                            <div className='song-manager-field-wrapper'>
                                <div class="form-check form-switch">
                                    <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={explicitChecked} onChange={(e) => setExplicitChecked(!explicitChecked)}/>
                                    <label class="form-check-label" for="flexSwitchCheckDefault" style={{fontSize:'0.8rem', top:'-1px', position: 'relative'}}>Is this song explicit?</label>
                                </div>
                            </div>
                            <div className='song-manager-field-wrapper' id={'insertSongWrapper'}>
                                <input className='song-entry' ref={file} id={'insertSong'} placeholder='' type="file" accept='.mp3'
                                value={song} onChange={(e) => {setSong(e.target.value); handleInputDisplay()}}>
                                </input>
                                <div className='management-input-click-div'>
                                    <button className='management-input-button' id={'insertSongButton'} onClick={() => {handleClick();}}> {editMode? 'Replace Current Song':'Import Song from Library'}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='song-manager-controls'>
                    <div className='controls-row row'>
                        <div className='album-manager-controls-icons col-2 col-sm-6'>
                            {editMode && <div className='controls-icons-left'>
                                <button onClick={() => deleteSong()}><span><FaTrashAlt/></span></button>
                            </div>}
                        </div>
                        <div className='album-manager-controls-save-create col-10 col-sm-6'>
                            <button className='create-save-button' onClick={() => {handleSongManager(); }}>{editMode ? 'Save' : 'Add Track'}</button>
                        </div>       
                    </div>
                </div>
                <div className='song-manager-footer'>
                    <div>
                        <span>GUIDANCE: Please note: Audio files uploaded to this site should be of .mp3 format. You can update the information of the music whilst listening,
                            but if any errors occur, please refresh the page!
                        </span>
                        <br></br>
                        <span style={{fontSize:'0.65rem', color:'white', textAlign:'center', marginTop:'5px'}}>To reorder tracks, drag a song by the options button.</span>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default SongManagement
