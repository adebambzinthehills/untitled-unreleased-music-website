import React, {useState, useRef, useEffect} from 'react'
import '../css/ContentManagement.css'
import { MdAddPhotoAlternate } from "react-icons/md"
import { FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import LibraryCard from './LibraryCard';
import grey from '../images/grey.jpeg'
import Select from 'react-select';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth, db, storage } from '../firebase'



export async function ReadProjectsFromFirebase(currentUser){
    const docRef = doc(db, "users", currentUser);
    const docSnap = await getDoc(docRef);
    var data;

    if(docSnap.exists()){
        data = docSnap.data().projects;
        console.log("Data! ", data)
    }
    else {
        console.log("There were no documents to be found!")
        data = []
    }

    return data

}

function AlbumManagement({clickOff, edit, mode, setMode, cards, setCards, setAlbumManagerMode, setNewProjectButtonClicked,
    information, setFirstCreationSuccessful, projects, setProjects, currentProject, setCurrentProject, projectKey
}) {

    const entryPhoto = useRef();
    const albumTitle = useRef();
    const labelText = useRef();
    const releaseDate = useRef();

    const [tempImage, setTempImage] = useState({backgroundImage: ''});
    const [firebaseUpdate, setFirebaseUpdate] = useState(false);

    const projectOptions = [
        { value: 'Single', label: 'Single' },
        { value: 'EP', label: 'EP' },
        { value: 'Album', label: 'Album' }
      ];
    const [projectTypeChoice, setProjectTypeChoice] = useState(projectOptions[0]);

    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: 'gray',
          border: '1px solid lightgray',
          height: '35px',
          minHeight: '35px'
        }),
        menu: (provided) => ({
          ...provided,
          color: 'white',
          backgroundColor: 'grey'
        }),
        indicatorsContainer: (provided, state) => ({
            ...provided,
            height: '35px',
          }),
        valueContainer: (provided, state) => ({
            ...provided,
            height: '35px'
          }),
        singleValue: (provided, state) => ({
            ...provided,
            height: '35px'
          }),
        input: (provided, state) => ({
            ...provided,
            height: '35px'
          }),
        
    };

    useEffect(() => {
        if(edit){
            setTempImage({backgroundImage: 'url(' +  information.image + ')', backgroundSize: '100% 100%'});
            albumTitle.current.value = information.title;
            labelText.current.value = information.label;

            let updateDay = ("0" + information.date[0]).slice(-2);
            let updateMonth = ("0" + information.date[1]).slice(-2);
            let updateDate = information.date[2] + "-" + updateMonth + "-" + updateDay;

            releaseDate.current.value =  updateDate;

            setProjectTypeChoice(information.type)
        }
    }, []);

    function handleClick() {
        const input = document.getElementsByClassName('management-input')[0];
        input.click();
    }

    function handleNewProject() {

            console.log("Current projects!: ", projects)
            var currentProjects = projects;

            let title = "New Album #";
            if(edit == false){
                title = title + (cards.length + 1)
            };
            let label = "Record Label Placeholder © 2024";
            let allowCreation = true;
            let releaseDateObject = ""; 
            let dateValue = [];
            let month = ""; // months from 1-12
            let day = "";
            let year = "";
            let newImageSrc = "";
            let albumImage = grey;
            let newImageAdded = false;
            let artist = "[artistname]"
            var key;
            
            if(edit == false){
                key = Math.floor(Math.random() * Date.now()).toString(36)
            }
            else {
                key = projectKey;
            }

            if(albumTitle.current.value != null && albumTitle.current.value.trim() != ""){
                title = albumTitle.current.value;
            }

            if(labelText.current.value != null && labelText.current.value.trim() != ""){
                label = labelText.current.value;
            }
            
            if(releaseDate.current.value != null || releaseDate.current.value.trim() != ""){
                releaseDateObject = new Date(releaseDate.current.value);
                month = releaseDateObject.getMonth() + 1;
                day = releaseDateObject.getDate();
                year = releaseDateObject.getFullYear();
                dateValue = [day, month, year, releaseDateObject]
            }
            else {
                allowCreation = false;
            }

            if(entryPhoto.current.files[0] != null){
                newImageAdded = true;
                if(newImageAdded){
                    let reader = new FileReader();
                    reader.readAsDataURL(entryPhoto.current.files[0]);

                    reader.onload = function() {
                    newImageSrc = reader.result;
                    // console.log(reader.result)
                    
                    // console.log(newImageSrc)
                    albumImage = reader.result;

                    if(edit == false){
                        if(allowCreation){

                            setCards([...cards, 
                                <LibraryCard key={key} id={key} title={title} artist="[artistname]" image={albumImage} type={projectTypeChoice} songs={0} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} label={label} date={dateValue}></LibraryCard>]
                            );

                            var currentProjects = projects;
                            currentProjects = [...currentProjects, 
                                {
                                key: key,
                                projectTitle: title,
                                projectType: projectTypeChoice,
                                artist: artist,
                                date: dateValue,
                                label: label,
                                image: albumImage,
                                colour: '',
                                songs: {}
                            }]
                            console.log('Current projects now: ', currentProjects)
                            setProjects(currentProjects);
                            writeProjectsToFirebase(currentProjects);

                            if(setFirstCreationSuccessful != null){
                                setFirstCreationSuccessful(true)
                            }

                        }
                            
                        else{
                            alert("Failed to make a new project! (Please make sure you've filled out the release date) - New Image")
                        }
                    }
                    else{
                        //if editing
                        if(allowCreation){
                            var tempProjects = [];
                            ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
                                let currentProjects = result
                                for(let i = 0; i < currentProjects.length; i++){
                                    let project = currentProjects[i];
                                    if(project.key == key){
                                        let updatedProject = {
                                            key: key,
                                            projectTitle: title,
                                            projectType: projectTypeChoice,
                                            artist: artist,
                                            date: dateValue,
                                            label: label,
                                            image: albumImage,
                                            colour: '',
                                            songs: currentProject.songs
                                        }
                                        setCurrentProject(updatedProject);
                                        tempProjects.push(updatedProject);
                                        console.log("Updated project values: ", updatedProject);
                                    }
                                    else{
                                        tempProjects.push(currentProjects[i])
                                    }
                                }
                                
                                console.log('Updated Projects! : ', tempProjects);
                                setProjects(tempProjects);
                                writeProjectsToFirebase(tempProjects)
                            });

                        }
                        else{
                            alert("Failed to save changes!");
                        }
                    }

                    }
                }

            }
            else {
                if(edit == false){
                    console.log("No file found!")
                    console.log(cards)
                    console.log(typeof(cards))
                    if(allowCreation){

                        setCards([...cards, 
                        <LibraryCard key={key} id={key}  title={title} artist="[artistname]" image={albumImage} type={projectTypeChoice} songs={0} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} label={label} date={dateValue}></LibraryCard>])
                        if(setFirstCreationSuccessful != null){
                            setFirstCreationSuccessful(true)
                        }
                        
                        var currentProjects = projects;
                        console.log(currentProjects)
                        currentProjects = [...currentProjects, 
                            {
                            key: key,
                            projectTitle: title,
                            projectType: projectTypeChoice,
                            artist: artist,
                            date: dateValue,
                            label: label,
                            image: albumImage,
                            colour: '',
                            songs: {}
                        }]
                        console.log('Current projects now: ', currentProjects)
                        setProjects(currentProjects);
                        writeProjectsToFirebase(currentProjects);

                    }
                    else{
                        alert("Failed to make a new project! (Please make sure you've filled out the release date)");
                    }
                }
                else {
                    console.log("Title! : " , title)
                    if(allowCreation){
                        var tempProjects = [];
                            ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
                                let currentProjects = result
                                for(let i = 0; i < currentProjects.length; i++){
                                    let project = currentProjects[i];
                                    if(project.key == key){
                                        let updatedProject = {
                                            key: key,
                                            projectTitle: title,
                                            projectType: projectTypeChoice,
                                            artist: artist,
                                            date: dateValue,
                                            label: label,
                                            image: currentProject.image,
                                            colour: '',
                                            songs: currentProject.songs
                                        }
                                        setCurrentProject(updatedProject);
                                        tempProjects.push(updatedProject);
                                        console.log("Updated project values: ", updatedProject);
                                    }
                                    else{
                                        tempProjects.push(currentProjects[i])
                                    }
                                }
                                
                                console.log('Updated Projects! : ', tempProjects);
                                setProjects(tempProjects);
                                writeProjectsToFirebase(tempProjects)
                            });
                    }
                    else{
                        alert("Failed to save changes!");
                    }
                }
            }
        
      }

    
    function setNewImage() {
        if(entryPhoto.current.files[0] != null){
            let reader = new FileReader();
            reader.readAsDataURL(entryPhoto.current.files[0]);

            reader.onload = function() {
                setTempImage({backgroundImage: 'url(' + reader.result + ')', backgroundSize: '100% 100%'});
            }
        }
        else{
            setTempImage({backgroundImage: ''});
        }
    }

    const { getCurrentUserIdString } = useAuth();

    async function writeProjectsToFirebase(projects){
        var currentUser = getCurrentUserIdString();
        await setDoc(doc(db, "users", currentUser), {projects});
        setProjects(ReadProjectsFromFirebase(currentUser))
    }

    

    return (
    <div className='album-manager-wrapper'>
        <div className='album-manager-click-off' onClick={() => {clickOff(false)}}></div>
        <div className='album-manager'>
            <div className='album-manager-header-wrapper'>
                <div className='album-manager-header'>
                    <h4>{edit ? 'Edit' : 'Create'} Project</h4>
                </div>
                <div className='album-manager-header-button-wrapper'>

                    {/* i removed: setMode(false); because i had no idea what it was doing and was breaking lmao */}
                    <button className='album-manager-header-button' onClick={() => {clickOff(false)}}><span><ImCross/></span></button>
                </div>
            </div>
            <div className='album-manager-content'>
                <div className='album-manager-image-wrapper' style={tempImage}>
                    <div className='album-manager-image-content' 
                            data-bs-toggle="tooltip" data-bs-placement="bottom" title="Please only upload square images for album art.">
                        <div className='hover-information'>
                            {/* this will appear on hover of image-content div */}
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
                        {/* this below should display none and take up full width and height of div */}
                        <input className="management-input" ref={entryPhoto} type="file" accept='image/jpg, image/png, image/jpeg, image/webp' onChange={() => setNewImage()}/>
                        <div className='management-input-click-div'>
                            <button className='management-input-button' onClick={() => handleClick()}></button>
                        </div>
                    </div>
                </div>
                <div className='album-manager-entry-wrapper'>
                    <div className='album-manager-entry-content'>
                        <div className='album-manager-field-wrapper'>
                            <div className='label-wrapper'><label htmlFor="">Project Name</label></div>
                            <input className='album-entry' ref={albumTitle} placeholder="What's your album title?"  data-bs-toggle="tooltip" data-bs-placement="top" title="This will be displayed in the menu and album page."></input>
                        </div>
                        <div className='album-manager-field-wrapper'>
                            <div className='label-wrapper'><label htmlFor="">Label</label></div>
                            <input className='album-entry' ref={labelText} placeholder='Who is the publisher/label?'  data-bs-toggle="tooltip" data-bs-placement="top" title="This will be displayed at the bottom of the album page, below the tracklist."></input>
                        </div>
                        <div className='album-manager-field-wrapper'>
                            <div className='label-wrapper'><label htmlFor="">Release Date</label></div>
                            <input className='album-entry' ref={releaseDate} type='date' placeholder="What's your album release date?" data-bs-toggle="tooltip" data-bs-placement="top" title="This will be displayed next to the album title, and again at the bottom of album page, much like Spotify's interface."></input>
                        </div>
                        <div className='album-manager-field-wrapper'>
                            {/* <div className='label-wrapper'><label htmlFor="">Project Type</label></div> */}
                            {/* <select className='album-entry' name='type' ref={releaseDate} type='select' placeholder="Single, EP or Album?">
                                <option value="single">Single</option>
                                <option value="ep">EP</option>
                                <option value="album">Album</option>
                            </select> */}
                            <Select options={projectOptions} 
                            className='project-select' 
                            classNamePrefix='project-select'
                            defaultValue={projectOptions[0]}
                            value={projectTypeChoice}
                            styles={customStyles}
                            isSearchable={false}
                            onChange={(choice) => {setProjectTypeChoice(choice); console.log(choice.value)}}></Select>
                        </div>
                    </div>
                </div>
            </div>
            <div className='album-manager-controls'>
                <div className='controls-row row'>
                    <div className='album-manager-controls-icons col-2 col-sm-6'>
                        {edit && <div className='controls-icons-left'>
                            <button><span><FaTrashAlt/></span></button>
                        </div>}
                    </div>
                    <div className='album-manager-controls-save-create col-10 col-sm-6'>
                        <button className='create-save-button' onClick={() => {handleNewProject(); clickOff(false)}}>{edit? 'Save' : 'Create'}</button>
                    </div>       
                </div>
            </div>
            <div className='album-manager-footer'>
                <div>
                    <span> Please note: Images uploaded should have a resolution of 600x600 pixels or more to get the proper scaling effect
                        in the fullscreen album window. Furthermore, please ensure that you have the rights to the images you upload.
                    </span>
                </div>
            </div>
        </div>
    </div>
    )
}

export default AlbumManagement
