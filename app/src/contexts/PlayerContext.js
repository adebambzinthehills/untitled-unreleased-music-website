import { createContext, useState } from 'react'
import purple from '../images/purple.jpeg'
import daytrippers from '../images/ctv3.jpeg'
import erys from '../images/erys.webp'
import wallsocket from '../images/wallsocket.jpeg'
import jane from '../audio/jane.wav'

export const PlayerContext = createContext();

export function PlayerProvider({children}){
    const [playerOn, setPlayerOn] = useState(false);
    const [playerImgSrc, setPlayerImgSrc] = useState(erys);
    const [playerUpdated, setPlayerUpdated] = useState(false);
    const [playerTracklist, setPlayerTracklist] = useState([{
        id: 0,
        title: 'i can touch my toes!',
        src: jane,
        author: 'adebambz!',
        thumbnail: wallsocket,
        album: 'do you want to go higher?'
    }])
    const [miniplayerEnabled, setMiniplayerEnabled] = useState(false);
    const [fullscreenPlayerEnabled, setFullscreenPlayerEnabled] = useState (false);
    const [externalPlayerBackgroundState, setExternalPlayerBackgroundState] = useState('');
    const [globalPlaying, setGlobalPlaying] = useState(false);
    const [globalShuffle, setGlobalShuffle] = useState(false);
    const [currentlyPlayingProjectKey, setCurrentlyPlayingProjectKey] = useState('');
    const [currentlyPlayingSongKey, setCurrentlyPlayingSongKey] = useState('');
    const [globalTrackIndex, setGlobalTrackIndex] = useState(0);
    const [playerPageKey, setPlayerPageKey] = useState('library');
    const [shuffleController, setShuffleController] = useState(false);

    const play = () => {
        setPlayerOn(true);
    }
    const stop = () => {
        setPlayerOn(false);
    }

    const toggle = () => {
        setPlayerOn(!playerOn);
    }

    const playerOff = () => {
        setPlayerOn(false);
    }

    const changePlayerImage = (src) => {
        setPlayerImgSrc(src);
    }

    const enableMiniplayer = () => {
        setMiniplayerEnabled(true);
    }

    const removeMiniplayer = () => {
        setMiniplayerEnabled(false);
    }

    const enableFullscreenPlayer = () => {
        setFullscreenPlayerEnabled(true);
    }

    const disableFullscreenPlayer = () => {
        setFullscreenPlayerEnabled(false);
    }

    const setPlayerTracks = (tracks) => {
        setPlayerTracklist(tracks)
    }

    const setExternalPlayerBackground = (colour) => {
        let colourVal = colour;
        console.log("Changing player background!");
        setExternalPlayerBackgroundState(colourVal)
    }

    return(
        <PlayerContext.Provider value={{playerOn, play, stop, toggle, playerImgSrc, 
        changePlayerImage, miniplayerEnabled, enableMiniplayer, removeMiniplayer,
        fullscreenPlayerEnabled, enableFullscreenPlayer, disableFullscreenPlayer,
        playerOff, playerTracklist, setPlayerTracklist, setPlayerTracks,
        playerUpdated, setPlayerUpdated, setExternalPlayerBackground, externalPlayerBackgroundState,
        setGlobalPlaying, globalPlaying, setGlobalShuffle, globalShuffle,
        currentlyPlayingProjectKey, setCurrentlyPlayingProjectKey, 
        globalTrackIndex, setGlobalTrackIndex, playerPageKey, setPlayerPageKey,
        shuffleController, setShuffleController, currentlyPlayingSongKey, setCurrentlyPlayingSongKey}}>
            {children}
        </PlayerContext.Provider>
    );
}