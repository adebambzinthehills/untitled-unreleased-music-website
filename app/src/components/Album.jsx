import React, { useEffect, useRef, useContext} from 'react'
import Tracklist from '../components/Tracklist'
import Player from './Player'
import Header from './Header'
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom'
import "../css/MusicContent.css"
import { FaPlay, FaPlus } from 'react-icons/fa'
import { IoMdPause } from "react-icons/io"
import { TiArrowShuffle } from "react-icons/ti"
import { BsThreeDots } from "react-icons/bs"
import { useState } from 'react'
import { IoChevronBack } from "react-icons/io5"
import { GoDotFill } from "react-icons/go";
import ColorThief from 'colorthief';
import { LuClock3 } from "react-icons/lu";
import { PlayerContext } from '../contexts/PlayerContext'
import { FaPalette } from "react-icons/fa";
import PaletteColourPicker from '../components/PaletteColourPicker'
import AlbumManagement from './AlbumManagement'
import { FaRegEdit} from 'react-icons/fa'
import { CiFolderOn } from 'react-icons/ci'
import { FaRegTrashCan } from 'react-icons/fa6'
import SongManagement from './SongManagement'
import { ReadProjectsFromFirebase, writeProjectsToFirebaseGlobal } from './AlbumManagement'
import { useAuth } from '../contexts/AuthContext';
import grey from '../images/grey.jpeg'
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db, storage } from '../firebase'
import { TbTable, TbTableRow } from 'react-icons/tb'
import { IoMdInformationCircle } from "react-icons/io";
import { ImCross } from 'react-icons/im'


function Album({player}) {
    const [loading, setLoading] = useState(true)
    const {playerOn, play, stop, toggle, setPlayerTracks, setPlayerTracklist, 
        setPlayerUpdated, playerUpdated, setExternalPlayerBackground,
        globalPlaying, setGlobalPlaying,
        currentlyPlayingProjectKey, setCurrentlyPlayingProjectKey,
        globalShuffle, setGlobalShuffle, setPlayerPageKey, setShuffleController,
        setTracksReordered, tracksReordered, setTracksReorderedIndex} = useContext(PlayerContext);


    const [tracks, setTracksState] = useState([]);
    const [selectedSongKey, setSelectedSongKey] = useState("")

    useEffect(() => {
        if(loading == false && tracks.length != 0 ){
            if(key == currentlyPlayingProjectKey){

                console.log("Updating player tracks!");
                console.log(tracks);
                setPlayerUpdated(!playerUpdated)
                setPlayerTracklist(tracks)
            }
        }
        if(tracksReordered){
            console.log("sadaf")
            ReadProjectsFromFirebase(getCurrentUserIdString()).then((res) => {
            let projects = res;
            let tempProjects = []
            for (let i = 0; i < projects.length; i++){
                let currentProject = projects[i];
                if(projects[i].key == key){
                    currentProject.songs = tracks;
                }
                tempProjects.push(currentProject)
                console.log(currentProject)
            }
            writeProjectsToFirebase(tempProjects)
            })
        }
    }, [tracks])


    const {state} = useLocation();
    const { key } = useParams();

    useEffect(() => {
        setPlayerPageKey(key)
    }, [])
    // console.log("Page key!: ", key )

    const { getCurrentUserIdString } = useAuth();

    const [backgroundColour, setBackgroundColour] = useState("");


    const [project, setProject] = useState(
        {
            key: 'key',
            projectTitle: '',
            projectType: {label: 'Single', value: 'Single'},
            artist: '',
            date: new Date(),
            label: '[label]',
            image: '',
            colour: '',
            songs: []
        }
    );
    const [projects, setProjects] = useState([])

    const setTracks = (val) => {
        setTracksState(val)
    }


    const [information, setInformation] = useState({
        title: '', 
        label: '[label]', 
        image: '', 
        artist: '',
        date: new Date(), 
        type: {label: 'Single', value: 'Single'},
        songs: '',
        duration: ''
    });


    useEffect(() => {
        console.log("Background updated!");

        if(currentlyPlayingProjectKey == key){
            setExternalPlayerBackground(backgroundColour);
        }
        
    }, [backgroundColour, currentlyPlayingProjectKey])


    
    useEffect(() => {
        

        ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
            
            let projectDuration = 0;
            for(let i = 0; i < project.songs.length; i++){
                projectDuration += project.songs[i].unformattedDuration
            }

            console.log("Unformatted duration!: ", projectDuration)

            console.log('Loaded project in album! : ', project);
            setInformation({
                title: project.projectTitle, 
                label: project.label, 
                image: project.image, 
                artist: project.artist ,
                date: project.date, 
                type: project.projectType,
                songs: project.songs.length,
                duration: projectDuration
            })

            setProjects(result)
            setBackgroundColour(project.colour)

            var musicHeaderColor = {
                backgroundColor: 'rgb(' + project.colour + ')',
                background: 'linear-gradient(rgb(' + project.colour + '), #121212)'
            }
            setMusicHeaderColourState(musicHeaderColor)
            setTracks(project.songs)
            console.log("Re-rendering and re-reading projects!")
            console.log("Information! : ", information)
            setLoading(false);
        });
    }, [project])

    useEffect(() => {
        ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
            setProjects(result)
            for(let i = 0; i < result.length ; i++){
                let project = result[i];
                if(project.key == key){
                    setProject(project);
                    setInformation({
                        title: project.projectTitle, 
                        label: project.label, 
                        image: project.image, 
                        artist: project.artist,
                        date: project.date, 
                        type: project.projectType
                    })
                    setBackgroundColour(project.colour)

                    if(currentlyPlayingProjectKey == key){
                        setExternalPlayerBackground(project.colour)
                    }
                }
            }
            console.log("Rendering and reading projects for the first time!")
            });
    }, [])

    

    const monthNames = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];

    const navigate = useNavigate();
    const [shuffle, setShuffle] = useState(false);
    const [paletteActive, setPaletteActive] = useState(false);
    const [paletteBlock, setPaletteBlock] = useState(false);
    const [fullAlbumCover, setFullAlbumCover] = useState(false);
    var contentShuffleButton = shuffle ? 'green-content-shuffle-button' : 'content-shuffle-button';
    var contentShuffleDotVisible = shuffle ? 'green-content-shuffle-dot' : 'green-content-shuffle-dot-invisible';

    var musicHeaderColor = {
        backgroundColor: 'rgb(' + backgroundColour + ')',
        background: 'linear-gradient(rgb(' + backgroundColour + '), #121212)'
    }

    var headerColour = {
        backgroundColor: 'rgb(' + backgroundColour + ')'
    }

    const [musicHeaderColourState, setMusicHeaderColourState] = useState(musicHeaderColor);

    function updateColourInDatabase(colour){
        let currentUser = getCurrentUserIdString()
        
        //set colour based on image NOT the choice e.g. default settings on first opening
        if(backgroundColour == ""){
            console.log("BG COLOUR IS EMPTY FOR SOME REASON!!!!!")
            setBackgroundColour(colour);
            setMusicHeaderColourState(musicHeaderColor);
        }

        ReadProjectsFromFirebase(currentUser).then((result) => {

            let tempProjects = [];
            let currentProjects = result
            for(let i = 0; i < currentProjects.length; i++){
                let project = currentProjects[i];
                if(project.key == key){
                    let updatedProject = project;
                    if (backgroundColour == ""){
                        updatedProject.colour = colour;
                    }
                    else {
                        updatedProject.colour = backgroundColour;
                    }
                    for(let i = 0; i < updatedProject.songs.length; i++){
                        updatedProject.songs[i].colour = updatedProject.colour
                    }
                    // setProject(updatedProject);
                    tempProjects.push(updatedProject);
                    console.log("Updated project values (colour): ", updatedProject);
                }
                else{
                    tempProjects.push(currentProjects[i])
                }
            }

            console.log('Updated Projects (Colour Change)! : ', tempProjects);
            setProjects(tempProjects);
            let currentUser = getCurrentUserIdString()
            writeProjectsToFirebase(tempProjects)

        });
            
           
    }

    async function writeProjectsToFirebase(projects){
        var currentUser = getCurrentUserIdString();
        await setDoc(doc(db, "users", currentUser), {projects});
        setProjects(ReadProjectsFromFirebase(currentUser))
    }

    useEffect(() => {
        const awaitPromise = new Promise((resolve) => {
            const contentImage = new Image();
            contentImage.src = information.image;
            contentImage.crossOrigin = 'anonymous';
            contentImage.onload = () => {
                const colorThief = new ColorThief();
                resolve(colorThief.getColor(contentImage));
            }
        })

        awaitPromise.then((res) => {
            updateColourInDatabase(res);

        }).catch((err) => {
            console.log(err);
            alert("Couldn't display album background colour!");
        })
        
    }, [information, backgroundColour])


    // try{document.body.getElementsByClassName('header')[0].style.backgroundColor = 'rgb(' + backgroundColour + ')';}
    // catch(err){}

    useEffect(() => {
        
        if(fullAlbumCover){
            document.body.style.overflow = 'hidden';
        }
        else{
            document.body.style.overflow = 'unset';
            document.body.style.paddingRight = '0px';
        }

    }, [fullAlbumCover]);

    // useEffect(() => {

    //     document.body.getElementsByClassName('content-background').style = musicHeaderColourState;
    //     document.body.getElementsByClassName('header')[0].style = musicHeaderColourState.backgroundColor;

    // }, [paletteActive])


    function goBack() {
        navigate('/library');
    }

    const [threeDotsClicked, setThreeDotsClicked] = useState(false);
    const [editAlbumButtonClicked, setEditAlbumButtonClicked] = useState(false);
    const [addTracksButtonClicked, setAddTracksButtonClicked] = useState(false);
    const [editTracksButtonClicked, setEditTracksButtonClicked] = useState(false);
    const [informationButtonClicked, setInformationButtonClicked] = useState(false);
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if(editAlbumButtonClicked || addTracksButtonClicked || editTracksButtonClicked || informationButtonClicked){
          document.body.style.overflow = 'hidden';
        }
        else{
          document.body.style.overflow = 'unset';
        }
      }, [editAlbumButtonClicked, addTracksButtonClicked, editTracksButtonClicked, informationButtonClicked])


    //   const screenSize = window.innerWidth;
    const [mobileView, setMobileView] = useState(false);
  
    function handleResize(){
        if(window.innerWidth <= 600){
            setMobileView(true);
        }
        else{
            setMobileView(false);
        }
    }

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    function formatAlbumTime(time){
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            if(minutes >= 60){
                const hours = Math.floor(time / 3600)
                const formatMinutes =`${Math.floor((time % 3600) / 60)} min`;
                const seconds = Math.floor();
                const formatSeconds =`${seconds} sec`;
                return `${hours} hr ${formatMinutes}`;
            }
            else {
                if(minutes >= 1){
                    const formatMinutes =`${minutes} min`;
                    const seconds = Math.floor(time % 60);
                    const formatSeconds =`${seconds} sec`;
                    return `${formatMinutes} ${formatSeconds}`;
                }
                else{
                    const seconds = Math.floor(time % 60);
                    const formatSeconds =`${seconds} sec`;
                    return `${formatSeconds}`;
                }
            }
        }
    };

    function formatAlbumTimeMobile(time){
        if (time && !isNaN(time)) {
            const minutes = Math.floor(time / 60);
            if(minutes >= 60){
                const hours = Math.floor(time / 3600)
                const formatMinutes =`${Math.floor((time % 3600) / 60)} min`;
                const seconds = Math.floor();
                const formatSeconds =`${seconds} sec`;
                return `${hours} hr ${formatMinutes}`;
            }
            else {
                const formatMinutes =`${minutes} min`;
                const seconds = Math.floor(time % 60);
                const formatSeconds =`${seconds} sec`;
                return `${formatMinutes}`;
            }
        }
    };

    async function ReadInformationFromFirebase(currentUser){
        const docRef = doc(db, "users", currentUser, 'information', currentUser);
        const docSnap = await getDoc(docRef);
        var data;
    
        if(docSnap.exists()){
            data = docSnap.data().information;
            // console.log("Data! ", data)
        }
        else {
            console.log("There were no documents to be found!")
            data = []
        }
    
        return data
    
    }

    const [artistImage, setArtistImage] = useState({background: ''})

    useEffect(() => {
        ReadInformationFromFirebase(getCurrentUserIdString()).then((res) => {
            setArtistImage({backgroundImage: 'url(' + res.profileImage + ')', backgroundSize: '100% 100%'})
        })
    }, [])

    function handlePlayPress(){
        if(tracks.length > 0){
            setPlayerTracklist(tracks); setPlayerUpdated(prev => !prev);setCurrentlyPlayingProjectKey(key); play(); setGlobalPlaying(prev => !prev);
        }
        else{
            alert("There are no tracks to be played!")
        }
    }

    function handleAlbumShuffle() {
        setShuffle(!shuffle); 
        if(key == currentlyPlayingProjectKey){
            setShuffleController(true)
            setGlobalShuffle(prev => !prev)
        }
    }

    useEffect(() => {
        if(globalShuffle && key == currentlyPlayingProjectKey){
            setShuffle(true)
        }
        else {
            setShuffle(false)
        }

    }, [globalShuffle])



    const artistNameRef = useRef();
    const projectHeaderRef = useRef();
    const spanWrapperRef = useRef()
    
    function handleDynamicClass() {

        if(artistNameRef.current != null && spanWrapperRef.current != null && projectHeaderRef.current != null) {
            if(artistNameRef.current.offsetWidth > 170 && window.innerWidth < 770){
                if(!spanWrapperRef.current.className.includes(" make-inline")){
                    spanWrapperRef.current.className = spanWrapperRef.current.className + " make-inline";
                }
            }
            else {
                if(spanWrapperRef.current.className.includes(" make-inline")){
                    let tempClassName = spanWrapperRef.current.className.replace(" make-inline", "");
                    spanWrapperRef.current.className = tempClassName;
                }
            }
        }
    }

    useEffect(() => {
        handleDynamicClass()
        window.addEventListener('resize', handleDynamicClass);
        
        return () => {
          window.removeEventListener('resize', handleDynamicClass);
        };
    }, [information]);

    return (
        
        <div className='content-page'>
            <Header colour={headerColour} ></Header>   
            
            <div className='content-background' style={paletteActive ? musicHeaderColourState : musicHeaderColor}>
                <div className='container'>
                    <div className='back-button-row'>
                        <div className='back-button-wrapper'>
                            <button className="back-button" onClick={()=> goBack()}>
                                <span><IoChevronBack/></span>
                            </button>
                        </div>
                        <div className='back-button-row-block'></div>
                    </div>
                </div>
                <div className='container'>
                    <div className='music-header'>
                        <div className='music-header-album-cover'>
                            <button className='music-header-cover-button' onClick={() => setFullAlbumCover(true)}>
                                <img className="content-cover" src={information.image}></img>
                            </button>
                        </div>
                        <div className = "music-content-information">
                            <div className='music-header-content-wrapper'>
                                {!mobileView && <span className='music-header-content-type'>{information.type.value}</span>}
                                {!mobileView && <h1>{information.title}</h1>}
                                { mobileView && <h1>{information.title}</h1>}
                                <div ref={projectHeaderRef} className='music-header-content-information-row' style={mobileView ? {display: 'block'} : {display: 'flex'}} >
                                    {!mobileView && 
                                        <span className='music-header-content-artist' ref={spanWrapperRef}>
                                        {/* <div style={{display: 'flex'}}> */}
                                            <div className='music-header-artist-image-wrapper' style={artistImage}></div> 
                                            <Link className="album-account-link" to="/account" ref={artistNameRef}>
                                            {information.artist}
                                            </Link> 
                                        {/* </div> */}
                                        
                                        {/* <div style={{display: 'flex'}}> */}
                                            <div style={{width:'4px'}}></div>
                                            • {information.date[2]} • {information.songs} {information.songs == 1 ? 'song': 'songs'}{information.songs == 0? '': ','} {information.songs > 0 ?formatAlbumTime(information.duration) : ''} 
                                        
                                        {/* </div> */}
                                        </span>}
                                        {mobileView && <span className='music-header-content-artist' style={{display: 'flex', marginBottom:'5px'}}>
                                            <div className='music-header-artist-image-wrapper' style={artistImage}></div>
                                            <Link className="album-account-link-no-hover" to="/account">
                                                {information.artist}
                                            </Link> 
                                        </span>}
                                    {mobileView && <span className='music-header-content-artist' style={{color: '#a7a7a7'}}>{information.type.value} • {information.date[2]} </span>}
                                </div>
                            </div>
                                
                        </div>
                    </div>
                    <div className='music-content-functions'>
                        <div className='content-button-wrapper'>
                            <button className='content-play-button' onClick={() => {handlePlayPress()}}><span>{globalPlaying && key == currentlyPlayingProjectKey ? (<IoMdPause className='pause'/>):(<FaPlay></FaPlay>)}</span></button>
                        </div>
                        <div className='content-other-functions'>
                            <div className='content-icon-wrapper'>
                                <button className={contentShuffleButton} onClick={()=> {handleAlbumShuffle()}}><span><TiArrowShuffle/></span></button>
                                <span className={contentShuffleDotVisible}><GoDotFill/></span>
                            </div>
                            <div className='content-icon-wrapper'>
                                <button className='content-dots-button' onClick={() => {setThreeDotsClicked(true); setEditAlbumButtonClicked(true)}}><span><BsThreeDots/></span></button>
                                {/* {threeDotsClicked && (
                                <div className='content-header-sub-menu' onMouseLeave={() => setThreeDotsClicked(false)}>
                                    <ul>
                                    <li><button onClick={() => setEditAlbumButtonClicked(true)}><span><FaRegEdit></FaRegEdit></span> Edit Album</button></li>
                                    <li><button disabled><span><CiFolderOn></CiFolderOn></span> Move to Folder</button></li>
                                    <li><button><span><FaRegTrashCan></FaRegTrashCan></span> Delete Album</button></li>
                                    </ul>
                                </div>
                                )} */}
                            </div>
                            <div className='content-icon-wrapper'>
                                <button className="content-information-button" onClick={() => setInformationButtonClicked(true)}>
                                    <span>
                                        <IoMdInformationCircle/>
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className='content-palette-wrapper'>
                            <PaletteColourPicker setBackgroundColour={setMusicHeaderColourState} setPaletteActive={setPaletteActive} setPaletteBlock={setPaletteBlock} image={information.image} changeBackgroundState={setBackgroundColour} projectKey={key}/>
                        </div>
                    </div>
                    {paletteBlock && <div className='palette-small-screen-block'>

                    </div>}
                    <div className='add-tracks-wrapper'>
                        <div>
                            <button className='content-add-tracks-button' onClick={() => setAddTracksButtonClicked(true)}><span><FaPlus/></span> Add Tracks</button>
                        </div>
                    </div>
                    <div className='tracklist-header'>
                        <div className='row tracklist-header-row'>
                            <div className='col-0-5 song-number song-number-header'>
                                <div className='number-header-wrapper'>
                                    <span>#</span>
                                </div>
                            </div>
                            <div className='col song-title-header'>
                                <div className='title-header-wrapper'></div>
                                <span>Title</span>
                            </div>
                            <div className='col-5 col-sm-4 col-md-3 track-header'>
                                <div className='clock-wrapper'>
                                    <span>
                                        <LuClock3/>
                                    </span>
                                </div>
                                <div className='empty-tracklist-header-space'>

                                </div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                </div>
            </div>

            <Tracklist songs={tracks.length} tracks={tracks} setTracks={setTracks} player={player} edit={setEditTracksButtonClicked} setMode={setEditMode} setSelectedSongKey={setSelectedSongKey} projectKey={key} setTracksReordered={setTracksReordered} setTracksReorderedIndex={setTracksReorderedIndex}></Tracklist>
            <div className='container information'>
                <div className='bottom-information-wrapper'>
                    <div className='bottom-information date'>
                        <span>{information.date[0]} {monthNames[(information.date[1] - 1)]} {information.date[2]}</span>
                    </div>
                    {mobileView && <div className='bottom-information time'>
                        <span>{information.songs} {information.songs == 1 ? 'song': 'songs'} {information.songs == 0? '': '•'} {information.songs > 0 ?formatAlbumTimeMobile(information.duration) : ''}</span>
                    </div>}
                    <div className='bottom-information label'>
                        <span>&copy; {information.label}</span>
                    </div>
                    <div className='bottom-information label'>
                        <span>&#9413; {information.label}</span>
                    </div>
                </div>    
            </div>
            {playerOn && <div className='player-block'></div>}

            {fullAlbumCover && <div className='fullscreen-album-cover-wrapper'>
                <div className='fullscreen-album-content'>
                    <div className='fullscreen-album-image-wrapper'>
                        <div className='cover-wrapper'>   
                            <img className='fullscreen-album-cover' src={information.image}/>
                            <div className='fullscreen-album-controls-wrapper'>
                                <div>
                                    <div className='fullscreen-album-controls'>
                                        <div className='fullscreen-control-wrapper' id='fcw-change-button'>
                                            <button className='fullscreen-change-button' onClick={()=> {setFullAlbumCover(false); setEditAlbumButtonClicked(true)}}>Change</button>
                                        </div>
                                        <div className='fullscreen-control-wrapper'>
                                            <button className='fullscreen-close-button' onClick={()=> setFullAlbumCover(false)}>Close</button>                           
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='fullscreen-album-clickable' onClick={()=> setFullAlbumCover(false)}>

                    </div>
                </div>
            </div>}
            {editAlbumButtonClicked &&
                <AlbumManagement projects={projects} setProjects={setProjects} clickOff={setEditAlbumButtonClicked} edit={true} information={information} setInformation={setInformation} currentProject={project} setCurrentProject={setProject} projectKey={key} setTracks={setTracks}/>
            }
            {
            (addTracksButtonClicked || editTracksButtonClicked) && 
                <SongManagement clickOff={setAddTracksButtonClicked} editClickOff={setEditTracksButtonClicked} editMode={editMode} setMode={setEditMode} tracks={tracks} setTracks={setTracks} currentProject={project} setProject={setProject} setProjects={setProjects} projectKey={key} selectedSongKey={selectedSongKey}/>
            }
            {informationButtonClicked &&
                <div className='information-fullscreen-wrapper'>
                    <div className='information-fullscreen'>
                        <div className='information-fullscreen-header-wrapper'>
                            <div className='information-fullscreen-header'>
                                <h4>Guidance for this Application</h4>
                            </div>
                            <div className='information-fullscreen-header-button-wrapper'>

                                {/* i removed: setMode(false); because i had no idea what it was doing and was breaking lmao */}
                                <button className='information-fullscreen-header-button' onClick={() => {setInformationButtonClicked(false)}}><span><ImCross/></span></button>
                            </div>
                        </div>
                        <hr></hr>
                        <div className='information-fullscreen-content'>
                            <p>When inserting an image into this application, be aware that the dominant colour in the image will likely be the colour background. </p>
                            <p>For example, inserting a primarily red image will result in a red background. In some cases the colour may not be accurate to the Spotify algorithm, 
                                so we have implemented a palette feature to change the colour of the background based on the image palette generated by the image, to give some correct options. </p>    
                            <p>In most cases, you should assume a similar colour (default colour after creating a project) will be used on Spotify, 
                            so please bare this in mind with your creative decisions and designs for the artwork.</p>
                        </div>
                    </div>
                    <div className='information-fullscreen-click-off' onClick={() => setInformationButtonClicked(false)}></div>
                </div>
            }
        </div>
    )
}

export default Album
