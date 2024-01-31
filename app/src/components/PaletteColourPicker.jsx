import React, {useState, useContext, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import '../css/MusicContent.css'
import ColorThief from 'colorthief';
import { FaPalette } from 'react-icons/fa';

function PaletteColourPicker({setBackgroundColour, setPaletteActive, setPaletteBlock}) {

    const {state} = useLocation();
    const [palette, setPalette] = useState([]);
    const [paletteVisible, setPaletteVisible] = useState(false);

    function handleVisibility() {
        setPaletteVisible(!paletteVisible);

        try{
            paletteVisible ? 
            document.body.getElementsByClassName('palette-menu')[0].style.display = 'none' : 
            document.body.getElementsByClassName('palette-menu')[0].style.display = 'flex'; 
        }
        catch(err){}

        setPaletteBlock(!paletteVisible)
    }


    useEffect(() => {
        const awaitPromise = new Promise((resolve) => {
            const contentImage = new Image();
            contentImage.src = state.image;
            contentImage.crossOrigin = 'anonymous';
            contentImage.onload = () => {
                const colorThief = new ColorThief();
                resolve(colorThief.getPalette(contentImage));
            }
        })

        awaitPromise.then((res) => {
            setPalette(res);
            setPaletteVisible(false);

        }).catch((err) => {
            console.log(err);
            alert("Couldn't get the palette image!");
        })
    }, [])

    function handleColourPicker(key){
        const colour = palette[key];

        const newContentColourBackground ={
            backgroundColor: 'rgb(' + colour + ')',
            background: 'linear-gradient(rgb(' + colour + '), #121212)'
        }

        console.log(document.body.getElementsByClassName('header'));
        document.body.getElementsByClassName('header')[0].style.backgroundColor = newContentColourBackground.backgroundColor;

        setBackgroundColour(newContentColourBackground);
        setPaletteActive(true);

    }

    return (
        <div className='palette-container'>
            <div className='palette-button-wrapper'>
                <button className='palette-button' onClick={() => handleVisibility()}><span><FaPalette/></span></button>
            </div>
            {paletteVisible && <div className='palette-menu'>
                {palette.map((paletteItem, i) => {
                    let paletteValue= 'rgb(' + paletteItem + ')';

                    let buttonColour ={
                        backgroundColor: paletteValue
                        }
                    return(
                        <div className='palette-picker'>
                            <button key={i} className='palette-picker-button' style={buttonColour}
                            onClick={() => handleColourPicker(i)}
                            ></button>
                        </div>
                    )
                })}
            </div>}
        </div>
    )
}

export default PaletteColourPicker
