import React, { useEffect, useRef, useContext} from 'react'
import Tracklist from '../components/Tracklist'
import Player from './Player'
import Header from './Header'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import "../css/MusicContent.css"
import { FaPlay, FaPlus } from 'react-icons/fa'
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
import { ReadProjectsFromFirebase } from './AlbumManagement'
import { useAuth } from '../contexts/AuthContext';
import grey from '../images/grey.jpeg'

function Album({player}) {

    const {playerOn, play, stop, toggle} = useContext(PlayerContext);

    const {state} = useLocation();
    const { key } = useParams();
    console.log("Page key!: ", key )

    const { getCurrentUserIdString } = useAuth();
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
            songs: {}
        }
    );
    const [projects, setProjects] = useState([])


    const [information, setInformation] = useState({
        title: '', 
        label: '[label]', 
        image: '', 
        artist: '',
        date: new Date(), 
        type: {label: 'Single', value: 'Single'}
    });

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
                }
            }
            console.log("Rendering and reading projects for the first time!")
            });
    }, [])

    useEffect(() => {
        
        console.log('Loaded project in album! : ', project);
        setInformation({
            title: project.projectTitle, 
            label: project.label, 
            image: project.image, 
            artist: project.artist,
            date: project.date, 
            type: project.projectType
        })

        ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
            setProjects(result)
            console.log("Re-rendering and re-reading projects!")
        });
    }, [project])

    const [tracks, setTracks] = useState([]);

    const monthNames = [ "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December" ];

    const navigate = useNavigate();
    const [shuffle, setShuffle] = useState(false);
    const [paletteActive, setPaletteActive] = useState(false);
    const [paletteBlock, setPaletteBlock] = useState(false);
    const [fullAlbumCover, setFullAlbumCover] = useState(false);
    const contentShuffleButton = shuffle ? 'green-content-shuffle-button' : 'content-shuffle-button';
    const contentShuffleDotVisible = shuffle? 'green-content-shuffle-dot' : 'green-content-shuffle-dot-invisible';
    const [backgroundColour, setBackgroundColour] = useState("");


    const musicHeaderColor = {
        backgroundColor: 'rgb(' + backgroundColour + ')',
        background: 'linear-gradient(rgb(' + backgroundColour + '), #121212)'
    }

    const headerColour = {
        backgroundColor: 'rgb(' + backgroundColour + ')'
    }

    const [musicHeaderColourState, setMusicHeaderColourState] = useState(musicHeaderColor);


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
            setBackgroundColour(res);
            setMusicHeaderColourState(musicHeaderColor);

        }).catch((err) => {
            console.log(err);
            alert("Couldn't display album background colour!");
        })
        
    }, [information])

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
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        if(editAlbumButtonClicked || addTracksButtonClicked || editTracksButtonClicked){
          document.body.style.overflow = 'hidden';
        }
        else{
          document.body.style.overflow = 'unset';
        }
      }, [editAlbumButtonClicked, addTracksButtonClicked, editTracksButtonClicked])


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
                                <h1>{information.title}</h1>
                                {!mobileView && <span className='music-header-content-artist'>{information.artist} • {information.date[2]} </span>}
                                {mobileView && <span className='music-header-content-artist'>{information.artist}</span>}
                                {mobileView && <span className='music-header-content-artist'>{information.type.value} • {information.date[2]} </span>}
                            </div>
                        </div>
                    </div>
                    <div className='music-content-functions'>
                        <div className='content-button-wrapper'>
                            <button className='content-play-button' onClick={toggle}><span><FaPlay></FaPlay></span></button>
                        </div>
                        <div className='content-other-functions'>
                            <div className='content-icon-wrapper'>
                                <button className={contentShuffleButton} onClick={()=> setShuffle(!shuffle)}><span><TiArrowShuffle/></span></button>
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
                        </div>
                        <div className='content-palette-wrapper'>
                            <PaletteColourPicker setBackgroundColour={setMusicHeaderColourState} setPaletteActive={setPaletteActive} setPaletteBlock={setPaletteBlock} image={information.image}/>
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

            <Tracklist songs={project.songs.length} tracks={project.songs} setTracks={setTracks} player={player} edit={setEditTracksButtonClicked} setMode={setEditMode}></Tracklist>
            <div className='container information'>
                <div className='bottom-information-wrapper'>
                    <div className='bottom-information date'>
                        <span>{information.date[0]} {monthNames[(information.date[1] - 1)]} {information.date[2]}</span>
                    </div>
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
                            <img className='fullscreen-album-cover' src={state.image}/>
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
                <AlbumManagement projects={projects} setProjects={setProjects} clickOff={setEditAlbumButtonClicked} edit={true} information={information} setInformation={setInformation} currentProject={project} setCurrentProject={setProject} projectKey={key}/>
            }
            {
            (addTracksButtonClicked || editTracksButtonClicked) && 
                <SongManagement clickOff={setAddTracksButtonClicked} editClickOff={setEditTracksButtonClicked} mode={editMode} setMode={setEditMode} tracks={tracks} setTracks={setTracks}/>
            }
        </div>
    )
}

export default Album
