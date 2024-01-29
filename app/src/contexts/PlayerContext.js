import { createContext, useState } from 'react'
import purple from '../images/purple.jpeg'

export const PlayerContext = createContext();

export function PlayerProvider({children}){
    const [playerOn, setPlayerOn] = useState(false);
    const [playerImgSrc, setPlayerImgSrc] = useState(purple);

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

    return(
        <PlayerContext.Provider value={{playerOn, play, stop, toggle, playerImgSrc}}>
            {children}
        </PlayerContext.Provider>
    );
}