import { createContext, useState } from 'react'
import purple from '../images/purple.jpeg'
import daytrippers from '../images/ctv3.jpeg'
import erys from '../images/erys.webp'

export const PlayerContext = createContext();

export function PlayerProvider({children}){
    const [playerOn, setPlayerOn] = useState(false);
    const [playerImgSrc, setPlayerImgSrc] = useState(erys);
    const [miniplayerEnabled, setMiniplayerEnabled] = useState(false);

    const play = () => {
        setPlayerOn(true);
        alert('');
    }
    const stop = () => {
        setPlayerOn(false);
    }
    const toggle = () => {
        setPlayerOn(!playerOn);
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

    return(
        <PlayerContext.Provider value={{playerOn, play, stop, toggle, playerImgSrc, changePlayerImage, miniplayerEnabled, enableMiniplayer, removeMiniplayer}}>
            {children}
        </PlayerContext.Provider>
    );
}