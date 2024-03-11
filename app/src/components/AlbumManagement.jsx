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
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject } from 'firebase/storage';
import { useNavigate, useLocation, useParams } from 'react-router-dom'



export async function ReadProjectsFromFirebase(currentUser){
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

export async function writeProjectsToFirebaseGlobal(projects, currentUser, {setProjects}){
    await setDoc(doc(db, "users", currentUser), {projects});
    setProjects(ReadProjectsFromFirebase(currentUser))
}

function AlbumManagement({clickOff, edit, mode, setMode, cards, setCards, setAlbumManagerMode, setNewProjectButtonClicked,
    information, setFirstCreationSuccessful, projects, setProjects, currentProject, setCurrentProject, projectKey, setTracks,
    selectedProject, libraryProjectKey}) {

    const [refresh, setRefresh] = useState(false)

    const entryPhoto = useRef();
    const albumTitle = useRef();
    const labelText = useRef();
    const releaseDate = useRef();

    const [tempImage, setTempImage] = useState({backgroundImage: ''});
    const [firebaseUpdate, setFirebaseUpdate] = useState(false);

    const [loadingProject, setLoadingProject] = useState(true)

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

    const location = useLocation().pathname;
    console.log(location)

    useEffect(() => {
        if(location == "/library" && libraryProjectKey != undefined){
            ReadProjectsFromFirebase(getCurrentUserIdString()).then((res) => {
                console.log("2H!", projectKey)
                projects = res;
                for(let i = 0; i < projects.length; i++){
                    if(projects[i].key == projectKey){
                        let informationValues = {
                            title: projects[i].projectTitle,
                            image: projects[i].image,
                            artist: projects[i].artist,
                            type: projects[i].projectType,
                            songs: projects[i].songs,
                            date: projects[i].date,
                            label: projects[i].label
                          }

                        
                        setTempImage({backgroundImage: 'url(' +  informationValues.image + ')', backgroundSize: '100% 100%'});
                        albumTitle.current.value = informationValues.title;
                        labelText.current.value = informationValues.label;

                        let updateDay = ("0" + informationValues.date[0]).slice(-2);
                        let updateMonth = ("0" + informationValues.date[1]).slice(-2);
                        let updateDate = informationValues.date[2] + "-" + updateMonth + "-" + updateDay;

                        releaseDate.current.value =  updateDate;

                        setProjectTypeChoice(informationValues.type)
                    }
                }

            })

        }
        else{
            console.log("Dumbass!")
        }
    }, [libraryProjectKey])

    useEffect(() => {
        let informationValues = ""
        if(location == "/library"){
            ReadProjectsFromFirebase(getCurrentUserIdString()).then((res) => {

                projects = res;
                for(let i = 0; i < projects.length; i++){
                    if(projects[i].key == projectKey){
                        informationValues = {
                            title: projects[i].projectTitle,
                            image: projects[i].image,
                            artist: projects[i].artist,
                            type: projects[i].projectType,
                            songs: projects[i].songs,
                            date: projects[i].date,
                            label: projects[i].label
                          }

                        
                        setTempImage({backgroundImage: 'url(' +  informationValues.image + ')', backgroundSize: '100% 100%'});
                        albumTitle.current.value = informationValues.title;
                        labelText.current.value = informationValues.label;

                        let updateDay = ("0" + informationValues.date[0]).slice(-2);
                        let updateMonth = ("0" + informationValues.date[1]).slice(-2);
                        let updateDate = informationValues.date[2] + "-" + updateMonth + "-" + updateDay;

                        releaseDate.current.value =  updateDate;

                        setProjectTypeChoice(informationValues.type)
                    }
                }

            })

        }
        else {
            informationValues = information
        }

        if(edit && (location.toLocaleLowerCase() != "/library")){

            setTempImage({backgroundImage: 'url(' +  informationValues.image + ')', backgroundSize: '100% 100%'});
            albumTitle.current.value = informationValues.title;
            labelText.current.value = informationValues.label;

            let updateDay = ("0" + informationValues.date[0]).slice(-2);
            let updateMonth = ("0" + informationValues.date[1]).slice(-2);
            let updateDate = informationValues.date[2] + "-" + updateMonth + "-" + updateDay;

            releaseDate.current.value =  updateDate;

            setProjectTypeChoice(informationValues.type)
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

                        let inputImage = new Image();
                        inputImage.src = albumImage;


                        // CROP FUNCTIONALITY -> PQINA.NL

                        inputImage.onload = () => {
                            let croppedFile = "";

                            const outputImageAspectRatio = 1;

                            const inputWidth = inputImage.naturalWidth;
                            const inputHeight = inputImage.naturalHeight;

                            // get the aspect ratio of the input image
                            const inputImageAspectRatio = inputWidth / inputHeight;

                            // if it's bigger than our target aspect ratio
                            let outputWidth = inputWidth;
                            let outputHeight = inputHeight;

                            let crop = true;


                            if (inputImageAspectRatio > outputImageAspectRatio) {
                                outputWidth = inputHeight * outputImageAspectRatio;
                                
                            } else if (inputImageAspectRatio < outputImageAspectRatio) {
                                outputHeight = inputWidth / outputImageAspectRatio;
                            }
                            else {
                                crop = false
                            }

                            if(crop){
                                // calculate the position to draw the image at
                                const outputX = (outputWidth - inputWidth) * 0.5;
                                const outputY = (outputHeight - inputHeight) * 0.5;

                                // create a canvas that will present the output image
                                const outputImage = document.createElement('canvas');

                                // set it to the same size as the image
                                outputImage.width = outputWidth;
                                outputImage.height = outputHeight;

                                // draw our image at position 0, 0 on the canvas
                                const ctx = outputImage.getContext('2d');
                                ctx.drawImage(inputImage, outputX, outputY);

                                outputImage.toBlob((blob) => {
                                    croppedFile = blob;
                                    console.log(croppedFile)

                                    let path = `${getCurrentUserIdString()}/${projectKey}/album-cover`;

                                        const storage = getStorage();
                                        const storageRef = ref(storage, path);

                                        var metadata = {
                                            contentType: "image"
                                        }

                                        console.log(storageRef.fullPath);

                                        if(allowCreation){
                                            let file;
                                            if(crop){
                                                file = croppedFile;
                                                metadata = {
                                                    contentType: 'image/jpeg'
                                                }
                                            }
                                            else {
                                                file = entryPhoto.current.files[0]
                                            }
                                            console.log(file)

                                            uploadBytes(storageRef, file, metadata).then((snapshot) => {
                                                console.log("Hey! I just uploaded an image file to my storage!")

                                                getDownloadURL(storageRef).then((url) => {

                                                    if(edit == false){
                                                        if(allowCreation){

                                                            setCards([...cards, 
                                                                <LibraryCard key={key} id={key} title={title} artist="[artistname]" image={url} type={projectTypeChoice} songs={0} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} label={label} date={dateValue}></LibraryCard>]
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
                                                                image: url,
                                                                colour: '',
                                                                songs: []
                                                            }]
                                                            console.log('Current projects now: ', currentProjects)
                                                            setProjects(currentProjects);
                                                            writeProjectsToFirebase(currentProjects);

                                                            if(setFirstCreationSuccessful != null){
                                                                setFirstCreationSuccessful(true)
                                                            }

                                                            clickOff(false)

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
                                                                        let newSongs = []
                                                                        for (let j = 0; j < project.songs.length ; j++){
                                                                            project.songs[j].album = title;
                                                                            project.songs[j].thumbnail = url
                                                                            newSongs.push(project.songs[j])
                                                                        }

                                                                        let updatedProject = {
                                                                            key: key,
                                                                            projectTitle: title,
                                                                            projectType: projectTypeChoice,
                                                                            artist: artist,
                                                                            date: dateValue,
                                                                            label: label,
                                                                            image: url,
                                                                            colour: '',
                                                                            songs: project.songs
                                                                        };
                                                                        setTracks(newSongs);
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

                                                                clickOff(false)
                                                            });

                                                        }
                                                        else{
                                                            alert("Failed to save changes!");
                                                        }
                                                    }
                                                });
                                            });
                                        }

                                }, 'image/jpeg');
                            }
                            else {
                                let path = `${getCurrentUserIdString()}/${projectKey}/album-cover`;

                                        const storage = getStorage();
                                        const storageRef = ref(storage, path);

                                        var metadata = {
                                            contentType: "image"
                                        }

                                        console.log(storageRef.fullPath);

                                        if(allowCreation){
                                            let file;
                                            if(crop){
                                                file = croppedFile;
                                                metadata = {
                                                    contentType: 'image/jpeg'
                                                }
                                            }
                                            else {
                                                file = entryPhoto.current.files[0]
                                            }
                                            console.log(file)

                                            uploadBytes(storageRef, file, metadata).then((snapshot) => {
                                                console.log("Hey! I just uploaded an image file to my storage!")

                                                getDownloadURL(storageRef).then((url) => {

                                                    if(edit == false){
                                                        if(allowCreation){

                                                            setCards([...cards, 
                                                                <LibraryCard key={key} id={key} title={title} artist="[artistname]" image={url} type={projectTypeChoice} songs={0} edit={setNewProjectButtonClicked} setMode={setAlbumManagerMode} label={label} date={dateValue}></LibraryCard>]
                                                            );

                                                            var currentProjects = projects;
                                                            console.log(projects)
                                                            currentProjects = [...currentProjects, 
                                                                {
                                                                key: key,
                                                                projectTitle: title,
                                                                projectType: projectTypeChoice,
                                                                artist: artist,
                                                                date: dateValue,
                                                                label: label,
                                                                image: url,
                                                                colour: '',
                                                                songs: []
                                                            }]
                                                            console.log('Current projects now: ', currentProjects)
                                                            setProjects(currentProjects);
                                                            writeProjectsToFirebase(currentProjects);

                                                            if(setFirstCreationSuccessful != null){
                                                                setFirstCreationSuccessful(true)
                                                            }

                                                            clickOff(false)

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
                                                                        let newSongs = []
                                                                        for (let j = 0; j < project.songs.length ; j++){
                                                                            project.songs[j].album = title;
                                                                            project.songs[j].thumbnail = url
                                                                            newSongs.push(project.songs[j])
                                                                        }

                                                                        let updatedProject = {
                                                                            key: key,
                                                                            projectTitle: title,
                                                                            projectType: projectTypeChoice,
                                                                            artist: artist,
                                                                            date: dateValue,
                                                                            label: label,
                                                                            image: url,
                                                                            colour: '',
                                                                            songs: project.songs
                                                                        };
                                                                        setTracks(newSongs);
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

                                                                clickOff(false)
                                                            });

                                                        }
                                                        else{
                                                            alert("Failed to save changes!");
                                                        }
                                                    }
                                                });
                                            });
                                        }
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

                        //colour is assigned a string but the bg colour function in album will take care of it
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
                            songs: []
                        }]
                        console.log('Current projects now: ', currentProjects)
                        setProjects(currentProjects);
                        writeProjectsToFirebase(currentProjects);

                        clickOff(false)

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
                                        let newSongs = []
                                        for (let j = 0; j < project.songs.length ; j++){
                                            project.songs[j].album = title;
                                            project.songs[j].thumbnail = currentProject.image
                                            newSongs.push(project.songs[j])
                                        }
                                        let updatedProject = {
                                            key: key,
                                            projectTitle: title,
                                            projectType: projectTypeChoice,
                                            artist: artist,
                                            date: dateValue,
                                            label: label,
                                            image: currentProject.image,
                                            colour: project.colour,
                                            songs: project.songs
                                        }
                                        setTracks(project.songs)
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

                                clickOff(false)
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

    const navigate = useNavigate();
    function LibraryTime() {
        navigate('/library');
    }

    function deleteProject(){
        if(window.confirm("Are you sure you want to delete this project?")){
            ReadProjectsFromFirebase(getCurrentUserIdString()).then((result) => {
                let projects = result;
                let tempProjects = []
                let albumCoverPath = `${getCurrentUserIdString()}/${projectKey}/album-cover`;

                const storage = getStorage();
                for(let i = 0; i < projects.length; i++){
                    let project = projects[i];
                    if(!(project.key == projectKey)){
                        tempProjects.push(project);
                    }
                    else{

                        for(let i = 0; i < project.songs.length; i++){

                            const storageRef = ref(storage, project.songs[i].path);

                            deleteObject(storageRef).then(() => {
                                console.log("Hooray! My track has been deleted [ADMIN]")
                            }).catch((error) => {
                                console.log("Error deleting the track in Firebase! [ADMIN]")
                            })
                        }

                        const storageRef = ref(storage, albumCoverPath);

                        deleteObject(storageRef).then(() => {
                            console.log("Hooray! My album cover has been deleted [ADMIN]")
                        }).catch((error) => {
                            console.log("Error deleting the album cover in Firebase! [ADMIN]")
                        })

                        clickOff(false);

                    }
                }
                setProjects(tempProjects);
                writeProjectsToFirebase(tempProjects)

                LibraryTime();
            })
        }
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
                            <button onClick={() => deleteProject()}><span><FaTrashAlt/></span></button>
                        </div>}
                    </div>
                    <div className='album-manager-controls-save-create col-10 col-sm-6'>
                        <button className='create-save-button' onClick={() => {handleNewProject(); }}>{edit? 'Save' : 'Create'}</button>
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
