import React, { useContext, useEffect, useState, useRef, useCallback, useLayoutEffect }from 'react'
import _ from 'lodash'


import '../css/Player.css'
import '../css/ProgressBar.css'
import { PlayerContext } from '../contexts/PlayerContext';

import { TiArrowShuffle } from "react-icons/ti"
import { FaPlay, FaPlus } from 'react-icons/fa'
import { IoIosSkipBackward } from "react-icons/io"
import { FaPause } from "react-icons/fa6"
import { IoMdPause } from "react-icons/io"
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { HiOutlineQueueList } from "react-icons/hi2";
import { TbMicrophone2 } from "react-icons/tb";
import { GoDotFill } from "react-icons/go";
import { BsThreeDots } from "react-icons/bs"
import { IoChevronBack } from "react-icons/io5";
import { Link, useLocation, useParams } from 'react-router-dom';


import { IoVolumeMedium, IoVolumeHigh, IoVolumeMute, IoVolumeLow} from "react-icons/io5";


import ColorThief from 'colorthief';

import { tracks } from '../audio/TemporaryTracks';

function Player() {

    const {playerOn, play, stop, toggle, playerImgSrc, changePlayerImage,
        miniplayerEnabled, enableMiniplayer, removeMiniplayer, 
        enableFullscreenPlayer, disableFullscreenPlayer, playerUpdated, setGlobalPlaying, globalPlaying,
        globalShuffle, setGlobalShuffle, currentlyPlayingProjectKey,
        globalTrackIndex, setGlobalTrackIndex, playerPageKey,
        shuffleController, setShuffleController, currentlyPlayingSongKey, setCurrentlyPlayingSongKey,
        tracksReordered, setTracksReordered, tracksReorderedIndex
    } = useContext(PlayerContext);  

    const { playerTracklist, setPlayerTracks} = useContext(PlayerContext);

    // console.log(playerTracklist)

    const [pageLoaded, setPageLoaded] = useState(false);

    // console.log("Rendering!")

    const [shufflePlayer, setShufflePlayer] = useState(false);
    const [repeatCount, setRepeatCount] = useState(0);
    const [repeatOn, setRepeatOn] = useState(false);
    const [playPress, setPlayPress] = useState(false);
    const [volume, setVolume] = useState(60);
    const [muteVolume, setMuteVolume] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const music = useRef();
    const [trackIndex, setTrackIndex] = useState(0);
    const [updatedTracklist, setUpdatedTracklist] = useState(playerTracklist);
    
    //make completely fresh copy of tracks
    const [tracksStorage, setTracksStorage] = useState(JSON.parse(JSON.stringify(playerTracklist)));
    const [shuffleTracksStorage, setShuffleTracksStorage] = useState(JSON.parse(JSON.stringify(playerTracklist)));

    const [shuffleTracks, setShuffleTracks] = useState(shuffleTracksStorage);

    var playlistOrder = shufflePlayer ? shuffleTracks : tracksStorage;
    const [tracklist, setTracklist] = useState(playlistOrder);

    const [currentTrack, setCurrentTrack] = useState(tracklist[trackIndex]);
    const [duration, setDuration] = useState(0);

    const [loading, setLoading] = useState(true);

    const [playerBackgroundColour, setPlayerBackgroundColour] = useState("");
    const [playerFullscreen, setPlayerFullscreen] = useState(false);

    const progressBarRef = useRef();
    const miniplayerProgressBarRef = useRef();
    const volumeBarRef = useRef();
    const [timeProgress, setTimeProgress] = useState(0);

    const animationRef = useRef();

    const playerAppearanceStyle = playerFullscreen? {display: 'block'} : {display: 'none'};


    const { pathname } = useLocation();
    useEffect(() => {

        const documentBody = document.body;

        if(playerFullscreen){
            documentBody.style.overflow = 'hidden';
        }
        else{
            documentBody.style.overflow = 'unset';
            documentBody.style.paddingRight = '0px';
        }

    }, [playerFullscreen]);

    useEffect(() => {
        setLoading(false)
    }, [])

    useEffect(() => {
        console.log("RE-RENDERING PLAYER!!!!!!!")
        console.log("Current player tracklist! : ", playerTracklist);
        setTracksStorage(JSON.parse(JSON.stringify(playerTracklist)))
        setShuffleTracksStorage(JSON.parse(JSON.stringify(playerTracklist)))
        setTracklist(playerTracklist)

        if(tracksReordered ){
            console.log("Yes!")
            console.log("Tracklist reordered!")
            if((_.isEqual(currentTrack, playerTracklist[tracksReorderedIndex]))){
                setTrackIndex(tracksReorderedIndex);
                setCurrentTrack(playerTracklist[tracksReorderedIndex]);
            }
            else {
                var index = playerTracklist.findIndex((track) => {
                    return track.key == currentlyPlayingSongKey
                });
                setTrackIndex(index)
                setCurrentTrack(playerTracklist[index])
            }
            setTracksReordered(false);
        }

    }, [playerTracklist])

    useEffect(() => {
        var defaultIndex;
        if(globalShuffle){
            setShufflePlayer(true);
            
            if(shuffleController){
                let newOrder = shuffle(tracksStorage, trackIndex);
                setShuffleTracks(newOrder); 
                playlistOrder = newOrder;
                setTracklist(newOrder);
                setTrackIndex(0);

                console.log('Shuffling!')
            }
        }
        else {
            setShufflePlayer(false);

            if(shuffleController){
                for(var i = 0; i < tracksStorage.length; i++){

                    console.log('current ',currentTrack.key)
                    console.log(':3', tracksStorage[i].key)
                    if(tracksStorage[i].key == currentTrack.key){
                        defaultIndex = i;
                    }
                }
                
                playlistOrder = tracksStorage;
                setTracklist(playlistOrder);
                console.log('Current Index', defaultIndex)
                setTrackIndex(defaultIndex)
                setCurrentTrack(tracksStorage[defaultIndex]); 
                console.log("Index! : ", defaultIndex)
            }
        }
    }, [globalShuffle])

    useEffect(() => {
        console.log(shuffleTracksStorage)
        setShuffleTracks(shuffleTracksStorage);
    }, [shuffleTracksStorage])

    useEffect(() => {
        if(globalTrackIndex != undefined){
            console.log("Global tracklist index: ", globalTrackIndex)
            setTrackIndex(globalTrackIndex)
            console.log(tracklist)
            setCurrentTrack(playerTracklist[globalTrackIndex])
        }
    }, [globalTrackIndex])

    useEffect(() => {
        console.log("New tracklist! : ", tracklist)
    }, [tracklist])

    useEffect(() => {
        playlistOrder = shufflePlayer ? shuffleTracks : tracksStorage;
        setTracklist(playlistOrder);
        console.log(playlistOrder[trackIndex])
        setCurrentTrack(playlistOrder[trackIndex]);
    }, [shuffleTracks])

    const {externalPlayerBackgroundState } = useContext(PlayerContext);

    useEffect(() => {
        console.log(pathname);
        if(pathname == "/library"){
            setPlayerBackgroundColour(currentTrack.colour)
        }
        else{
            setPlayerBackgroundColour(externalPlayerBackgroundState);
        }
        console.log("Background!");

    }, [externalPlayerBackgroundState, currentlyPlayingProjectKey])

    useEffect(() => {
        if(pathname == "/library"){
            setPlayerBackgroundColour(currentTrack.colour)
        }
        else{
            setPlayerBackgroundColour(externalPlayerBackgroundState);
        }
        console.log("Background!");
        console.log(playerPageKey)
    }, [])

    useEffect(() => {
        if(pathname == "/library"){
            setPlayerBackgroundColour(currentTrack.colour)
        }
        else{
            setPlayerBackgroundColour(externalPlayerBackgroundState);
        }
        console.log("Background!");
        console.log(playerPageKey)
    }, [currentTrack])

    // console.log("State !!! :/ : " , externalPlayerBackgroundState)
    
    useEffect(() => {
        // let image = (currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail

        // const awaitPromise = new Promise((resolve) => {
        //     const contentImage = new Image();
        //     contentImage.src = image;
        //     contentImage.crossOrigin = 'anonymous';
        //     contentImage.onload = () => {
        //         const colorThief = new ColorThief();
        //         resolve(colorThief.getColor(contentImage));
        //     }
        // })

        // awaitPromise.then((res) => {
        //     console.log(res);
        //     setPlayerBackgroundColour(externalPlayerBackgroundState)

        // }).catch((err) => {
        //     console.log(err);
        //     alert("Couldn't display player background colour!");
        // })

        setCurrentlyPlayingSongKey(currentTrack.key)

    }, [currentTrack, currentlyPlayingProjectKey])




    let newPlayerColourValues = [];
    let newPlayerScrollbarColourValues = [];
    for(let i = 0; i < playerBackgroundColour.length; i++){
        newPlayerColourValues.push(playerBackgroundColour[i] - 40);
        newPlayerScrollbarColourValues.push(playerBackgroundColour[i] * 0.95);
    }
    newPlayerColourValues = 'rgb(' + newPlayerColourValues + ')';
    newPlayerScrollbarColourValues = 'rgb(' + newPlayerScrollbarColourValues + ')';
 
    const playerColour ={
        backgroundColor: newPlayerColourValues
    }

    const playerButtonColour = {
        fill: newPlayerColourValues
    } 

    const playerScrollbarColour = {
        backgroundColor: newPlayerScrollbarColourValues
    }

    //fisher-yates-durnstenfield shuffle feb 17

    function shuffle(editList, currentPlayingIndex) {
        var list = JSON.parse(JSON.stringify(editList));
        var newList = new Array(list.length);


        newList[0] = tracksStorage[currentPlayingIndex];
        console.log('newList[0] reference: ', newList[0]);

        var tempList = [];
        var tempListCounter = 0;
        for(let i = 0; i < list.length ; i++){
            if(!(_.isEqual(newList[0], list[i]))){
                tempList[tempListCounter] = list[i];
                console.log(i, ' number: ', list[i]);

                console.log(tempListCounter)
                tempListCounter = tempListCounter + 1;
            }
        }
        console.log('tempListCounter', tempListCounter)
        console.log('tempList reference: ', tempList);


        //i actually don't know why some are undefined so i will prune
        tempList = tempList.filter((element) => {
            return element !== undefined
        });

        for (let i = 0; i < tempList.length; i++) {
            var j = i + Math.floor(Math.random() * (list.length - i));
    
            var temp = tempList[j];
            tempList[j] = tempList[i];
            tempList[i] = temp;

            // console.log('list[i] reference: ' , list[i]);
        }

        for(let i = 0; i < tempList.length; i++){
            newList[i+1]= tempList[i];
        }

        newList = newList.filter((element) => {
            return element !== undefined
        });

        console.log('newList at end: ', newList)

        console.log('List: ', list);
        return newList;
    }

    const handleShuffle = () => {
        setShufflePlayer(!shufflePlayer);
        setShuffleController(false)
        setGlobalShuffle(prev => !prev)

        var defaultIndex;
        if(shufflePlayer){

            for(var i = 0; i < tracksStorage.length; i++){

                console.log('current ',currentTrack.key)
                console.log(':3', tracksStorage[i].key)
                if(tracksStorage[i].key == currentTrack.key){
                    defaultIndex = i;
                }
            }
            
            playlistOrder = tracksStorage;
            setTracklist(playlistOrder);
            console.log('Current Index', defaultIndex)
            setTrackIndex(defaultIndex)
            setCurrentTrack(tracksStorage[defaultIndex]); 
            // music.current.currentTrack = tracksStorage[defaultIndex];
              
        }

        else {
            
            let newOrder = shuffle(tracksStorage, trackIndex);
            setShuffleTracks(newOrder); 
            playlistOrder = newOrder;
            setTracklist(newOrder);
            setTrackIndex(0);

            console.log('Shuffling!')
        }

        console.log('tracks: ', tracks);
        console.log('tracksStorage: ',tracksStorage);
        console.log('shuffleTracks: ', shuffleTracks);
    } 

    useEffect(() => {
        console.log(playlistOrder);
        playlistOrder = shufflePlayer ? shuffleTracks : tracksStorage;
    }, [playlistOrder])

    function handleRepeat(){
        let newCount = (repeatCount + 1) % 3;

        if(newCount == 1){
            //green on repeat (one_)
            setRepeatOn(true);
        }
        else if (newCount == 2){
        }
        else {
            //white repeat
            setRepeatOn(false);
        }

        setRepeatCount(newCount);

    };

    function handlePlayPress() {
        setPlayPress(!playPress);
        setIsPlaying(!isPlaying);
        setGlobalPlaying(prev => !prev)
    }

    useEffect(() => {
        if(globalPlaying){
            setPlayPress(true);
            setIsPlaying(true);
        }
        else{
            setPlayPress(false);
            setIsPlaying(false);
        }
    }, [globalPlaying])

    // ----------- IMPORTANT CODE FOR PLAYING BELOW -------------
     
    const repeatAnimationFrame = useCallback(() => {

        if(playerOn){
            if(music.current && progressBarRef.current && miniplayerProgressBarRef.current){
            const currentTime = music.current.currentTime;

            setTimeProgress(currentTime);
            
            progressBarRef.current.value = currentTime;
            progressBarRef.current.style.setProperty(
                '--range-progress',
                `${(progressBarRef.current.value / duration) * 100}%`
            );

            miniplayerProgressBarRef.current.value = currentTime;
            miniplayerProgressBarRef.current.style.setProperty(
                '--range-progress',
                `${(miniplayerProgressBarRef.current.value / duration) * 100}%`
            );

            animationRef.current = requestAnimationFrame(repeatAnimationFrame);
            }
        }
        
    }, [music, duration, progressBarRef, setTimeProgress]);

    useEffect(() => {
        if(isPlaying){
            music.current.play().catch((err) => console.log("Error playing! : ", err));
        }
        else {
            music.current.pause();
        }
        animationRef.current = requestAnimationFrame(repeatAnimationFrame);
    }, [isPlaying, music, repeatAnimationFrame, playerFullscreen])


    const greenShuffle = shufflePlayer ? 'green-shuffle' : '';
    const greenRepeat = repeatOn? 'green-repeat' : '';

    const screenSize = window.innerWidth;
    const [miniplayerTracker, setMiniplayerTracker] = useState(false);

    useEffect(() => {
        if(screenSize <= 600){
            enableMiniplayer();
            setMiniplayerTracker(true);
        }
        else{
            removeMiniplayer();
            setMiniplayerTracker(false);
        }
    }, [miniplayerTracker]);

    /* ---------- PROGRESS BAR ----------- */
    

    function handleProgress(){
        // allows you to move the progress bar and set the music time and value
        music.current.currentTime = progressBarRef.current.value;
    }

    function onLoadedMetadata (){
        const seconds = music.current.duration;
        setDuration(seconds);
        progressBarRef.current.max = seconds;
        miniplayerProgressBarRef.current.max = seconds;
      };

    useEffect(() => {
        const seconds = music.current.duration;
        setDuration(seconds);
        progressBarRef.current.max = seconds;
        miniplayerProgressBarRef.current.max = seconds
    }, [playerFullscreen])

    function formatTime(time){
        if (time && !isNaN(time)) {
          const minutes = Math.floor(time / 60);
          const formatMinutes =
            minutes < 10 ? `${minutes}` : `${minutes}`;
          const seconds = Math.floor(time % 60);
          const formatSeconds =
            seconds < 10 ? `0${seconds}` : `${seconds}`;
          return `${formatMinutes}:${formatSeconds}`;
        }
        return '00:00';
    };
    
    function skipPlay() {
        setPlayPress(true);
        setIsPlaying(true);
    }
    //confirm state update when track
    useEffect(() => { console.log('New track index', trackIndex)}, [trackIndex] )

    function handleSkip() {
        let currentIndex = trackIndex;
        
        if(!(repeatCount == 2)){
            if(repeatCount == 0){
                if(currentIndex >= (tracklist.length - 1) ){
                    currentIndex = 0
                    setPlayPress(false);
                    setIsPlaying(false);  
                    setGlobalPlaying(false)  ;
                    setTrackIndex((currentIndex));
                    setCurrentTrack(tracklist[currentIndex])
                    console.log("I'm here too somewhere!")
                    progressBarRef.current.currentTime = 0;
                    miniplayerProgressBarRef.current.currentTime = 0;
                    music.current.currentTime = 0;
                }
                else{
                    skipPlay();
                    setTrackIndex((currentIndex + 1));
                    setCurrentTrack(tracklist[currentIndex + 1])
                }
                
            }
            else{
                if(trackIndex >= tracklist.length - 1 ){
                    setTrackIndex(0);
                    currentIndex = 0
                    setCurrentTrack(tracklist[currentIndex]);

                    progressBarRef.current.currentTime = 0;
                    miniplayerProgressBarRef.current.currentTime = 0;
                    music.current.currentTime = 0;
                    music.current.play().catch((err) => console.log("Error playing! : ", err));
                }
                else{
                    setTrackIndex(currentIndex + 1);
                    setCurrentTrack(tracklist[currentIndex + 1])
                    skipPlay();
                }
            }
        }
        else {
            progressBarRef.current.currentTime = 0;
            miniplayerProgressBarRef.current.currentTime = 0;
            music.current.currentTime = 0;
            music.current.play().catch((err) => console.log("Error playing! : ", err));
        }
    }

    function handleReload() {
        let currentIndex = trackIndex;
        if(!(repeatCount == 2)){
            if(!(music.current.currentTime <= 3) && currentIndex != 0){
                if(music.current.currentTime <= 0.5){
                    if(trackIndex == 0){
                        currentIndex = tracklist.length - 1;
                        setTrackIndex(currentIndex);
                        setCurrentTrack(tracklist[currentIndex]);
                    }
                    else{
                        setTrackIndex(currentIndex- 1);
                        setCurrentTrack(tracklist[currentIndex - 1])
                    }
                }
                else{
                    progressBarRef.current.currentTime = 0;
                    miniplayerProgressBarRef.current.currentTime = 0;
                    music.current.currentTime = 0;
                }
            }
            else {
                if(trackIndex == 0){
                    currentIndex = 0
                    setTrackIndex(currentIndex);
                    setCurrentTrack(tracklist[currentIndex]);
                    progressBarRef.current.currentTime = 0;
                    miniplayerProgressBarRef.current.currentTime = 0;
                    music.current.currentTime = 0;
                }
                else{
                    setTrackIndex(currentIndex- 1);
                    setCurrentTrack(tracklist[currentIndex - 1])
                }
                music.current.play().catch((err) => console.log("Error playing! : ", err));
            }
        }
        else {
            progressBarRef.current.currentTime = 0;
            miniplayerProgressBarRef.current.currentTime = 0;
            music.current.currentTime = 0;
        }
        setPlayPress(true);
        setIsPlaying(true);  
    }


    /*  ------ MARQUEE SCROLLING FOR TEXT ON PLAYER ------*/
    // Update the state or perform any other actions when the
          // browser is resized

    //create refs
    const fullscreenSongTitle = useRef();
    const fullscreenArtistName = useRef();
    const fullscreenAlbumTitle = useRef();
    const fullscreenSongTitleWrapper = useRef();
    const fullscreenArtistNameWrapper = useRef();
    const fullscreenAlbumTitleWrapper = useRef();

    const miniplayerSongTitle = useRef();
    const miniplayerArtistName = useRef();
    const miniplayerSongTitleWrapper = useRef();
    const miniplayerArtistNameWrapper = useRef();

    const songTitle = useRef();
    const artistName = useRef();
    const songTitleWrapper = useRef();
    const artistNameWrapper = useRef();
    
    // console.log("PLayer fullscreen value outside of handleResize: ", playerFullscreen)

    function handleResize() {

        function applyClassesAndScroll(wrapperWidths, widths, wrappers, items, fullscreen){

            for(let i = 0; i < wrapperWidths.length; i++){
                // console.log(wrappers[i].current.className)
                // console.log('current width id: ', items[i], '; current width: ', widths[i])

                // console.log(widths[i] - wrapperWidths[i])
                if(widths[i] > wrapperWidths[i]){
                    
                    // console.log("Span width is greater than wrapper width at postion ", i , "!");
                    // console.log(wrappers[i].current.className)
    
                    if(i == 2 && fullscreen){
                        if(!wrappers[i].current.className.includes(" justify-left")){
                            wrappers[i].current.className = wrappers[i].current.className + " justify-left";
                        }
                    }
    
                    if(!wrappers[i].current.className.includes(" scrollable")){
                        wrappers[i].current.className = wrappers[i].current.className + " scrollable";
                    }
    
                    items[i].current.style.setProperty(
                        '--transform-width',
                        `${-(widths[i] - wrapperWidths[i])}px`
                    );
                    wrappers[i].current.style.setProperty(
                        '--transform-width',
                        `${-(widths[i] - wrapperWidths[i])}px`
                    );
    
                    // console.log(widths[i] - wrapperWidths[i]);
                }
                else {
                    if(wrappers[i].current.className.includes(" scrollable")){
                        let tempClassName = wrappers[i].current.className.replace(" scrollable", "");
                        wrappers[i].current.className = tempClassName;
                    }
    
                    if(wrappers[i].current.className.includes(" justify-left")){
                        let tempClassName = wrappers[i].current.className.replace(" justify-left", "");
                        wrappers[i].current.className = tempClassName;
                    }
    
                    items[i].current.style.setProperty(
                        '--transform-width', 0
                    );
                    wrappers[i].current.style.setProperty(
                        '--transform-width', 0
                    );
                }
            }
        }

        // console.log("Player fullscreen: ", playerFullscreen);

        if(playerFullscreen){
            
            // console.log("Running when fullscreen!");

            var fullscreenSongTitleWrapperWidth = fullscreenSongTitleWrapper.current.clientWidth;
            var fullscreenSongTitleWidth = fullscreenSongTitle.current.clientWidth;
            var fullscreenArtistNameWrapperWidth = fullscreenArtistNameWrapper.current.clientWidth;
            var fullscreenArtistNameWidth =  fullscreenArtistName.current.clientWidth;
            var fullscreenAlbumTitleWrapperWidth = fullscreenAlbumTitleWrapper.current.clientWidth;
            var fullscreenAlbumTitleWidth = fullscreenAlbumTitle.current.clientWidth;
    
            var fullscreenWrapperWidths = [fullscreenSongTitleWrapperWidth, fullscreenArtistNameWrapperWidth, fullscreenAlbumTitleWrapperWidth];
            var fullscreenWidths = [fullscreenSongTitleWidth, fullscreenArtistNameWidth, fullscreenAlbumTitleWidth];
            var wrappers = [fullscreenSongTitleWrapper, fullscreenArtistNameWrapper, fullscreenAlbumTitleWrapper];
            var items = [fullscreenSongTitle, fullscreenArtistName, fullscreenAlbumTitle];

            applyClassesAndScroll(fullscreenWrapperWidths, fullscreenWidths, wrappers, items, true);
    
            /*for(let i = 0; i < fullscreenWrapperWidths.length; i++){
                if(fullscreenWidths[i] > fullscreenWrapperWidths[i]){
                    console.log("Fullscreen: Span width is greater than wrapper width at postion ", i , "!");
                    console.log(wrappers[i].current.className)

                    if(i == 2){
                        if(!wrappers[i].current.className.includes(" justify-left")){
                            wrappers[i].current.className = wrappers[i].current.className + " justify-left";
                        }
                    }

                    if(!wrappers[i].current.className.includes(" scrollable")){
                        wrappers[i].current.className = wrappers[i].current.className + " scrollable";
                    }

                    items[i].current.style.setProperty(
                        '--transform-width',
                        `${-(fullscreenWidths[i] - fullscreenWrapperWidths[i])}px`
                    );
                    wrappers[i].current.style.setProperty(
                        '--transform-width',
                        `${-(fullscreenWidths[i] - fullscreenWrapperWidths[i])}px`
                    );

                    console.log(fullscreenWidths[i] - fullscreenWrapperWidths[i]);
                }
                else {
                    console.log(wrappers[i].current.className)
                    if(wrappers[i].current.className.includes(" scrollable")){
                        let tempClassName = wrappers[i].current.className.replace(" scrollable", "");
                        wrappers[i].current.className = tempClassName;
                    }

                    if(wrappers[i].current.className.includes(" justify-left")){
                        let tempClassName = wrappers[i].current.className.replace(" justify-left", "");
                        wrappers[i].current.className = tempClassName;
                    }

                    items[i].current.style.setProperty(
                        '--transform-width', 0
                    );
                    wrappers[i].current.style.setProperty(
                        '--transform-width', 0
                    );
                }
            }*/
            
        }
        if (!playerFullscreen){

            //had to use offsetWidth for some reason to make this work!

            // console.log("Running when player is not fullscreen!");
            var songTitleWidth = songTitle.current.offsetWidth;
            var songTitleWrapperWidth = songTitleWrapper.current.clientWidth;
            var artistNameWidth = artistName.current.offsetWidth;
            var artistNameWrapperWidth = artistNameWrapper.current.clientWidth;

            var wrapperWidths = [artistNameWrapperWidth, songTitleWrapperWidth];
            var widths = [artistNameWidth, songTitleWidth];
            var wrappers = [artistNameWrapper, songTitleWrapper];
            var items = [artistName, songTitle]

            applyClassesAndScroll(wrapperWidths, widths, wrappers, items, false);
        
        }

        var miniplayerSongTitleWidth = miniplayerSongTitle.current.offsetWidth;
        var miniplayerSongTitleWrapperWidth = miniplayerSongTitleWrapper.current.clientWidth;
        var miniplayerArtistNameWidth = miniplayerArtistName.current.offsetWidth;
        var miniplayerArtistNameWrapperWidth = miniplayerArtistNameWrapper.current.clientWidth;

        var miniplayerWrapperWidths = [miniplayerArtistNameWrapperWidth, miniplayerSongTitleWrapperWidth];
        var miniplayerWidths = [miniplayerArtistNameWidth, miniplayerSongTitleWidth];
        var miniplayerWrappers = [miniplayerArtistNameWrapper, miniplayerSongTitleWrapper];
        var miniplayerItems = [miniplayerArtistName, miniplayerSongTitle];

        applyClassesAndScroll(miniplayerWrapperWidths, miniplayerWidths, miniplayerWrappers, miniplayerItems, false);

        // console.log('Artist Title: ', artistTitleSpanWidth);
        // console.log("Resizing window!");
    }
    
    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
        };
    }, [playerFullscreen]);

    useEffect(() => {
        handleResize();
    }, [trackIndex, playerFullscreen])

    useEffect(() => {
        if (music) {
            music.current.volume = volume / 100;
            music.current.muted = muteVolume;
        }
      }, [volume, music, muteVolume]);

    useEffect(() => {
        if(volume > 0){
            setMuteVolume(false)
        }
    }, [volume])

    useEffect(() => {
        if(volumeBarRef.current){
            volumeBarRef.current.style.setProperty(
                '--volume-progress', `${volume}%`
                );
        }
    }, [playerFullscreen])

    
  return (

    <div>
    <audio src={currentTrack.src} ref={music} onLoadedMetadata={() => onLoadedMetadata()} onEnded={() => handleSkip()}/>
      { !playerFullscreen &&
        <div className='player-container'>
        <div className='row player-row'>
            <div className='col-3 player-col'>
                <div className='left-information-wrapper'>
                    <div className='player-image-wrapper'>
                        <Link to={`/project/${currentlyPlayingProjectKey}`} style={{textDecoration: 'none', color:'inherit'}}>
                            <button className='player-image-button'><img className='player-image' src={(currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail }></img></button>
                        </Link>
                    </div>
                    <div className='player-song-information-wrapper'>
                        <div className="span-information-wrap" ref={songTitleWrapper} >
                            <span className='player-song-name' ref={songTitle} ><a>{currentTrack.title}</a></span>
                        </div>
                        <div className='span-information-wrap-two' ref={artistNameWrapper} >
                            <span className='player-artist-name' ref={artistName}>{currentTrack.author}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-6'>
                <div className='player-controls-wrapper'>
                    <div className='player-buttons-wrapper'>
                        <div className='player-button-wrapper'>
                            <button className={'player-shuffle-button ' + greenShuffle} onClick={() => handleShuffle()}><span><TiArrowShuffle/></span></button>
                            {shufflePlayer && <span className='player-shuffle-button-dot'><GoDotFill/></span>}
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-rewind-button' onClick={() => handleReload()}><span><IoIosSkipBackward/></span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='player-pause-button'/> : <FaPlay/>}</span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className='player-skip-button' onClick={() => handleSkip()}><span><IoIosSkipBackward/></span></button>
                        </div>
                        <div className='player-button-wrapper'>
                            <button className={'player-repeat-button ' + greenRepeat} onClick={() => handleRepeat()}><span>{repeatCount <= 1? <LuRepeat/> : <LuRepeat1/>}</span></button>
                            {(repeatCount === 1 || repeatCount === 2) && <span className='player-repeat-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>
                    <div className='player-scrollbar-wrapper'>
                        <div className='player-time-wrapper normal left'><span className='player-time-left'>{formatTime(timeProgress)}</span></div>
                        <div className='player-scrollbar'>
                            {/* <div className='player-scrollbar-grey'>
                                <div className='player-scrollbar-overlay'>
                                    <div className='player-scrollbar-dot'></div>
                                </div>
                            </div> */}
                            <input className="player-scrollbar-input" type="range" onChange={() => handleProgress()} ref={progressBarRef}></input>
                        </div>
                        <div className='player-time-wrapper normal'><span className='player-time-right'>{formatTime(duration)}</span></div>
                    </div>
                </div>
            </div>
            <div className='col-3'>
                <div className='right-information-wrapper'>
                    <div className='player-lyrics-wrapper'>
                        <button className='player-lyrics-button'><span><TbMicrophone2/></span></button>
                    </div>
                    <div className='player-queue-wrapper'>
                        <button className='player-queue-button'><span><HiOutlineQueueList/></span></button>
                    </div> 
                    <div className='player-volume-button'>
                        <button onClick={() => setMuteVolume((prev) => !prev)}>
                            <span>
                            {muteVolume || volume == 0 ? (
                                <IoVolumeMute />
                            ) : volume < 20 ? (
                                <IoVolumeLow />
                            ) : volume < 50 ? (
                            <IoVolumeMedium/>
                            ): 
                            (<IoVolumeHigh />)}
                            </span>
                        </button>
                    </div>
                    <div className="player-volume-wrapper">
                        <input className="player-volume-slider" ref={volumeBarRef} type="range" min={0} max={100} value={volume} onChange={(e) => {setVolume(e.target.value); volumeBarRef.current.style.setProperty(
                        '--volume-progress', `${e.target.value}%`
                        );}}/>
                    </div>
                </div>
            </div>
        </div>
      </div>}
      <div className='miniplayer-container' style={playerColour}>
        <div className='row miniplayer-row'>
            <div className='col-10 player-col '>
                <div className='miniplayer-left-information-wrapper'>
                    <div className='miniplayer-image-wrapper'>
                        <button className='miniplayer-image-button'><img className='miniplayer-image' src={(currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail }></img></button>
                    </div>
                    <div className='miniplayer-song-information-wrapper'>
                        <div className='span-information-wrap-three' ref={miniplayerSongTitleWrapper}>
                            <span className='player-song-name' ref={miniplayerSongTitle}><a ref={miniplayerSongTitle}>{currentTrack.title}</a></span>
                        </div>
                        <div className='span-information-wrap-four' ref={miniplayerArtistNameWrapper}>
                            <span className='player-artist-name mini' ref={miniplayerArtistName}><a ref={miniplayerArtistName}>{currentTrack.author}</a></span>
                        </div>
                    </div>
                </div>
                <div className='miniplayer-full-button-wrapper'><button className='miniplayer-full-button' onClick={() => {setPlayerFullscreen(true); document.body.style.overflow = 'hidden'; enableFullscreenPlayer()}}></button></div>
            </div>
            <div className='col-2 player-col miniplayer-play-pause'>
                <div className='miniplayer-control-wrapper'>
                    <div className='miniplayer-play-button-wrapper'>
                        <button className='miniplayer-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='miniplayer-pause-button'/> : <FaPlay/>}</span></button>
                    </div>
                </div>
            </div>
            <div className='col-12 miniplayer-scrollbar-div'>
                <div className='player-scrollbar miniplayer'>
                    <input className="player-scrollbar-input" type="range" style={playerScrollbarColour} ref={miniplayerProgressBarRef}></input>
                </div>      
            </div>
        </div>
      </div>
      { playerFullscreen && 
        <div className='fullscreen-player' style={{... playerColour, ... playerAppearanceStyle}}>
          <div className='fullscreen-player-header row'> 
            <div className='col-2 fullscreen-player-close'>
                <button className="fullscreen-player-close-button" onClick={() => {setPlayerFullscreen(false); disableFullscreenPlayer();}}>
                    <span><IoChevronBack/></span>
                </button>
            </div>
            <div className='col-8 fullscreen-player-content-title-wrapper'>
                <div className='fullscreen-player-content-title' ref={fullscreenAlbumTitleWrapper} >
                    <span ref={fullscreenAlbumTitle}>{currentTrack.album}</span>
                </div>
            </div>
            <div className='col-2 fullscreen-player-three-dots'>
                <div className='fullscreen-player-three-dots-wrapper'>
                    <button className='fullscreen-player-three-dots-button'>
                        <span><BsThreeDots/></span>
                    </button>
                </div>
            </div>
        </div>
        <div className='fullscreen-player-image-section'>
            <div className='fullscreen-player-image-wrapper'>
                <div className='fullscreen-player-image-square'>
                    <img className='fullscreen-player-image' src={(currentTrack.thumbnail == '' || currentTrack.thumbnail == null ) ? playerImgSrc : currentTrack.thumbnail }/>
                </div>
            </div> 
        </div>
        <div className='fullscreen-player-information-section'>
            <div className='fullscreen-player-information-wrapper'>
                <div className='fullscreen-player-song-title' ref={fullscreenSongTitleWrapper}>
                    <span><h1 ref={fullscreenSongTitle}><Link to={`/project/${currentlyPlayingProjectKey}`} style={{textDecoration: 'none', color:'white'}} onClick={() => {setPlayerFullscreen(false); disableFullscreenPlayer();}}>{currentTrack.title}</Link></h1></span>
                </div>
                <div className='fullscreen-player-artist-name' ref={fullscreenArtistNameWrapper}>
                    <span ref={fullscreenArtistNameWrapper}><Link to={`/account`} style={{textDecoration: 'none', color:'#dfdfdf'}} onClick={() => {setPlayerFullscreen(false); disableFullscreenPlayer();}}><span ref={fullscreenArtistName}>{currentTrack.author}</span></Link></span>
                </div>
            </div>
        </div>
        <div className='fullscreen-player-rest-section'>
            <div className='fullscreen-player-controls-wrapper'>
                <div className='player-scrollbar-wrapper fullscreen'>
                    <div className='player-scrollbar fullscreen'>
                        {/* <div className='player-scrollbar-grey'>
                            <div className='player-scrollbar-overlay'>
                                <div className='player-scrollbar-dot'></div>
                            </div>
                        </div> */}
                        <input className="player-scrollbar-input" type="range" onChange={() => handleProgress()} ref={progressBarRef} style={playerScrollbarColour}></input>
                    </div>
                    <div className='fullscreen-time-wrapper'>
                        <div className='player-time-wrapper fullscreen left'><span className='player-time-left'>{formatTime(timeProgress)}</span></div>
                        <div className='player-time-wrapper fullscreen right'><span className='player-time-right right '>{formatTime(duration)}</span></div>
                    </div>
                </div>
                <div className='fullscreen-buttons-wrapper row'>
                    <div className='col-2-4 player-buttons-section-col'>
                        <div className='fullscreen-button-wrapper float-left'>
                            <button className={'player-shuffle-button ' + greenShuffle} onClick={() => handleShuffle()}><span><TiArrowShuffle/></span></button>
                            {shufflePlayer && <span className='player-shuffle-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>
                    <div className='col-2-4'>
                        <div className='fullscreen-button-wrapper media-flex-middle'>
                            <button className='player-rewind-button' onClick={() => handleReload()}><span><IoIosSkipBackward/></span></button>
                        </div>
                    </div>
                    <div className='col-2-4 player-buttons-section-col flex-middle'>
                        <div className='fullscreen-button-wrapper'>
                            <button className='player-play-button' onClick={() => handlePlayPress()}><span>{playPress ? <IoMdPause className='player-pause-button' style={{... playerButtonColour, left:'0.5px', top:'0px'}}/> : <FaPlay style={{... playerButtonColour, left:'2px', top:'0px'}}/>}</span></button>
                        </div>
                    </div>
                    <div className='col-2-4 player-buttons-section-col'>
                        <div className='fullscreen-button-wrapper media-flex-middle'>
                            <button className='player-skip-button' onClick={() => handleSkip()}><span><IoIosSkipBackward/></span></button>
                        </div>
                    </div>
                    <div className='col-2-4'>
                        <div className='fullscreen-button-wrapper float-right'>
                            <button className={'player-repeat-button ' + greenRepeat} onClick={() => handleRepeat()}><span>{repeatCount <= 1? <LuRepeat/> : <LuRepeat1/>}</span></button>
                            {(repeatCount === 1 || repeatCount === 2) && <span className='player-repeat-button-dot'><GoDotFill/></span>}
                        </div>
                    </div>  
                </div>
            </div>
            <div className='fullscreen-bottom-right'>
                <div className='fullscreen-right-information-wrapper'>
                    <div className='player-lyrics-wrapper'>
                        <button className='player-lyrics-button'><span><TbMicrophone2/></span></button>
                    </div>
                    <div className='player-queue-wrapper'>
                        <button className='player-queue-button'><span><HiOutlineQueueList/></span></button>
                    </div>
                </div>
            </div>
          </div>   
        </div>}
      
    </div>
  )
}

export default Player
