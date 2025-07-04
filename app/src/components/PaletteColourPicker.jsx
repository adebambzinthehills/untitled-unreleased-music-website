import React, {useState, useContext, useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import '../css/MusicContent.css'
import ColorThief from 'colorthief';
import { FaPalette } from 'react-icons/fa';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext';

function PaletteColourPicker({setBackgroundColour, setPaletteActive, setPaletteBlock, image, key, changeBackgroundState, projectKey}) {

    const [palette, setPalette] = useState([]);
    const [paletteVisible, setPaletteVisible] = useState(false);

    //control whether palette menu is visible
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

    //get colours
    useEffect(() => {
        const awaitPromise = new Promise((resolve) => {
            const contentImage = new Image();
            contentImage.src = image;
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
    }, [image])

    async function writeProjectsToFirebase(projects){
        var currentUser = getCurrentUserIdString();
        await setDoc(doc(db, "users", currentUser), {projects});
    }

    async function ReadProjectsFromFirebase(currentUser){
        const docRef = doc(db, "users", currentUser);
        const docSnap = await getDoc(docRef);
        var data;
    
        if(docSnap.exists()){
            data = docSnap.data().projects;
            // console.log("Data! ", data)
        }
        else {
            console.log("There were no documents to be found!")
            data = []
        }
    
        return data
    
    }

    const { getCurrentUserIdString } = useAuth();

    //handles new colour choice for the project, updates states and writes to database
    function handleColourPicker(key){
        const colour = palette[key];

        const newContentColourBackground ={
            backgroundColor: 'rgb(' + colour + ')',
            background: 'linear-gradient(rgb(' + colour + '), #121212)'
        }

        console.log(document.body.getElementsByClassName('header'));
        document.body.getElementsByClassName('header')[0].style.backgroundColor = newContentColourBackground.backgroundColor;


        setBackgroundColour(newContentColourBackground);
        changeBackgroundState(colour);
        setPaletteActive(true);


        ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
            let currentProjects = result;
            let tempProjects = [];
            for(let i = 0; i < currentProjects.length; i++){
                let project = currentProjects[i];
                if(project.key == projectKey){
                    console.log("Writing new colour to the database!")
                    project.colour = colour
                    for(let i = 0; i < project.songs.length; i++){
                        project.songs[i].colour = colour
                    }
                }
                tempProjects.push(project)
            }
            if(tempProjects.length > 0){
                writeProjectsToFirebase(tempProjects)
            }

        });

    }

    return (
        <div className='palette-container'>
            <div className='palette-button-wrapper'>
                <button className='palette-button' onClick={() => handleVisibility()}
                    data-bs-toggle="tooltip" data-bs-placement="top" title="Change the colour background of the project, by clicking on one of the colour values!"
                ><span><FaPalette/></span></button>
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
