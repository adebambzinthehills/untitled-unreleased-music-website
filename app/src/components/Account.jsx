import React, { useContext, useState, useEffect, useRef } from 'react'
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { logOut} from '../contexts/AuthContext';
import { MdAccountCircle, MdAddPhotoAlternate } from "react-icons/md";
import '../css/Account.css';
import background from '../images/b.png';
import { PlayerContext } from '../contexts/PlayerContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, setDoc, getDoc, updateDoc , deleteDoc} from "firebase/firestore"; 
import { auth, db, storage } from '../firebase'
import { getStorage, uploadBytes, ref, getDownloadURL, deleteObject , listAll} from 'firebase/storage';
import { get } from 'lodash';
import { getFunctions, httpsCallable } from "firebase/functions";

function Account() {
    const {playerOn } = useContext(PlayerContext); 
    const { getCurrentUserIdString, deleteAccount } = useAuth(); 

    const [artistInformation, setArtistInformation] = useState({
        artistName: '[artistname]',
        profileImage: ''
    })

    const [artistName, setArtistName] = useState('')
    const [profileImageBlob, setProfileImageBlob] = useState('');
    const artistNameRef = useRef();

    async function writeInformationToFirebase(information){
        var currentUser = getCurrentUserIdString();
        await setDoc(doc(db, "users", currentUser, 'information', currentUser), {information});
    }

    async function writeProjectsToFirebase(projects){
        var currentUser = getCurrentUserIdString();
        await setDoc(doc(db, "users", currentUser), {projects});
    }

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

    const { playerOff } = useContext(PlayerContext);
    const[imageActive, setImageActive] = useState(false);
    const [artistImage, setArtistImage] = useState({backgroundImage: ''});
    const [artistImageValue ,setArtistImageValue] = useState('')
    
    //const { logOut } = useAuth();
    const navigate = useNavigate();
    const artistPhoto = useRef();

    async function handleLogOut(){
        playerOff();
        try{
            await logOut();
            navigate("/login");
        }
        catch(e){
            alert("Unable to log out!");
            console.log(e);
        }
    }

    useEffect(() => {
        if(getCurrentUserIdString() == null || getCurrentUserIdString() == undefined){
            navigate("/login")
        }
    }, [])

    function handleClick() {
        const input = document.getElementsByClassName('profile-management-input')[0];
        input.click();
    }

    

    function setNewImage() {
        if(artistPhoto.current.files[0] != null){
            let reader = new FileReader();
            reader.readAsDataURL(artistPhoto.current.files[0]);

            reader.onload = function() {
                let image = reader.result;

                let inputImage = new Image();
                inputImage.src = image;


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

                        var imagePath = URL.createObjectURL(blob)

                        setArtistImage({backgroundImage: 'url(' + imagePath + ')', backgroundSize: '100% 100%'});
                        setArtistImageValue(imagePath);
                        setProfileImageBlob(blob)
  
                    });
                }
            }

            
        }
        else{
            setArtistImage({backgroundImage: ''});
            setArtistImageValue('')
            setProfileImageBlob('')
        }

    }

    function uploadImage(){
        if(artistPhoto.current.files[0] != null){
            var imagePath = URL.createObjectURL(profileImageBlob)
            let path = `${getCurrentUserIdString()}/profile-image`;

            const storage = getStorage();
            const storageRef = ref(storage, path);

            var metadata = {
                contentType: "image"
            }

            console.log(storageRef.fullPath);

            
            let file = profileImageBlob;
            metadata = {
                contentType: 'image/jpeg'
            }

            uploadBytes(storageRef, file, metadata).then((snapshot) => {
                console.log("Hey! I just uploaded an image file to my storage!")

                console.log('State! : ', artistInformation)

                getDownloadURL(storageRef).then((url) => {
                        let newArtistInformation = {
                            artistName: artistName.trim(),
                            profileImage: url
                        }
                        writeInformationToFirebase(newArtistInformation);

                });
            });
        }
        else{
            setArtistImage({backgroundImage: ''});
            setArtistImageValue('')
        }
    }




    useEffect(() => {
        ReadInformationFromFirebase(getCurrentUserIdString()).then((res) => {
            if(res.artistName != undefined && res.profileImage != undefined){
                setArtistInformation(res);

                setArtistImage((prev) => ({backgroundImage: 'url(' + res.profileImage + ')', backgroundSize: '100% 100%'}));
                setArtistName(res.artistName);
                setArtistImageValue(res.profileImage)
            }
        })
    }, [])

    useEffect(() => {
        console.log("Coding!")
        setArtistImage({backgroundImage: 'url(' + artistInformation.profileImage + ')', backgroundSize: '100% 100%'})
        setArtistImageValue(artistInformation.profileImage);
        console.log("Artist Image! : ", artistImage)
    }, [artistInformation])

    useEffect(() => {
        if(artistName != undefined){
            
        }
    }, [artistName])

    function handleSave() {
        let artistNameVal= ''
        if(artistName.trim() == ""){
            setArtistName("[artistname]")
            artistNameVal = "[artistname]"
        }
        else {
            artistNameVal = artistName.trim()
        }

        let newArtistInformation = {
            artistName: artistNameVal,
            profileImage: artistImageValue
        }
        if(profileImageBlob != undefined && profileImageBlob != ''){
            uploadImage(profileImageBlob)
        }
        writeInformationToFirebase(newArtistInformation)
        setArtistInformation(newArtistInformation);

        ReadProjectsFromFirebase(getCurrentUserIdString()).then((res) => {
            let projects = res;
            let tempProjects = []
            for (let i = 0; i < projects.length; i++){
                let project = projects[i]
                project.artist = artistNameVal;
                for(let j = 0; j < project.songs.length; j++){
                    project.songs[j].author = artistNameVal
                }

                tempProjects.push(project)
            }
            writeProjectsToFirebase(tempProjects)
        })
    }

    async function handleDeleteAccount() {
        if(window.confirm("Are you sure you want to delete your account? (This operation cannot be undone!)")){
            let currentUser = getCurrentUserIdString();
            await deleteDoc(doc(db, "users", currentUser)).then(() => {
                console.log("Deleted projects!");
            }).catch((err) => {
                console.log("Error deleting projects! : ",err)
            });
            await deleteDoc(doc(db, "users", currentUser, 'information', currentUser)).then(() => {
                console.log("Deleted information!")
            }).catch((err) => {
                console.log("Error deleting information! : ",err)
            });
            // try {
            //     logOut()
            //     console.log("Logged out!")
            // }
            // catch(err) {
            //     console.log("Error logging out!", err);
            // }
            const storage = getStorage();
            const path = `${getCurrentUserIdString()}/`
            const storageRef = ref(storage, path);
            await listAll(storageRef).then((res) => {
                console.log(res.prefixes);

                //delete top level information (profile image)! 
                const promises = res.items.map((item) => {
                    let itemPath = `${item.fullPath}`
                    const profileRef = ref(storage, itemPath)

                    console.log(itemPath)
                    return deleteObject(profileRef).then(() => console.log("Deleted profile pic!")).catch((err) => console.log("Couldn't delete profile pic!"));
                  });
                Promise.all(promises);
                
                //find all album folders
                for(let i = 0; i < res.prefixes.length; i++){
                    let prefixPath = res.prefixes[i].fullPath

                    console.log(prefixPath)
                    const prefixStorageRef = ref(storage, prefixPath)


                    listAll(prefixStorageRef).then((res) => {
                        console.log(res)

                        //delete all album covers
                        const promises = res.items.map((item) => {

                            let albumPath = item.fullPath
                            const albumRef = ref(storage, albumPath)
                            return deleteObject(albumRef).then(() => console.log("Deleted album cover!")).catch((err) => console.log("Couldn't delete album cover!"));
                        });

                        Promise.all(promises);

                        console.log(res.prefixes)
                        //get all track folders
                        const prefixPromises = res.prefixes.map((prefix) => {
                            const trackStorageRef = ref(storage, prefix.fullPath)
                            listAll(trackStorageRef).then((res) => {

                                //delete tracks
                                const promises = res.items.map((item) => {
                                    let trackPath = item.fullPath;
                                    console.log(trackPath)
                                    const trackRef = ref(storage, trackPath)
                                    return deleteObject(trackRef).then(() => console.log("Deleted song!")).catch((err) => console.log("Couldn't delete song!"));
                                });

                                Promise.all(promises);
                            })
                            
                        })
                    })
                }   
            }).catch((err) => {
                console.log(err)
            })

            await deleteAccount().then(() => {
                console.log("Deleted account!")
            }).catch((err) => {
                console.log("Error deleting account! : ", err)
            });
            navigate("/");

        }
    }


    return (
        <div className='accountPageBackground'>
            {/* <img src={background}></img> */}
            <Header></Header>
            <div className='container account'>
                <div className='accountDetails'>
                    <h1>Your Account</h1>
                    <div className='iconWrapper'>
                        <div className='profile-manager-image-wrapper' style={artistImage} >
                            <div className='profile-manager-image-content' 
                                   >
                                <div className='profile-hover-information'>
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
                                {/* {imageActive ? <img/> : <div className='accountIcon'><MdAccountCircle /></div>} */}
                                <div className='profile-manager-image'>
                                    <img/>
                                </div>
                                {/* this below should display none and take up full width and height of div */}
                                <input className="profile-management-input" type="file" accept='image/jpg, image/png, image/jpeg, image/webp' ref={artistPhoto} onChange={() => {setNewImage()}}/>
                                <div className='profile-management-input-click-div'>
                                    <button className='profile-management-input-button' onClick={() => handleClick()}></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='section' style={{display:'block', justifyContent:'center', fontWeight:'500', color:'#a7a7a7', fontSize:'0.8rem', marginTop:'-10px', textAlign: 'center'}}>
                        <span style={{color:'#d7d7d7'}}>Your Profile Picture</span>
                        <p style={{fontSize:'0.8em'}}>GUIDANCE: This will be displayed in the album page, next to the artist name. Press on the image to change it.</p>
                    </div>
                    <div className='section'>
                        <div className='editDetailsHeader container'>
                            <h2>Edit Details</h2>
                        </div>
                        <div className='form details'>
                            <div className='form-group'>
                                <h4>Artist Name</h4>
                                <input className='account' placeholder='Enter an artist name, the default is [artistname]' ref={artistNameRef} value={artistName} onChange={(e) => setArtistName(e.target.value)}></input>
                            </div>
                            <p style={{fontSize:'0.7rem', color:'#a7a7a7', textAlign:'center'}}>GUIDANCE: This will be displayed in your project, tracklist and player when listening to music.</p>

                            {/* <div className='form-group'>
                                <h4>Email Address</h4>
                                <input disabled className='account'></input>
                            </div> */}
                            <div className='row' style={{display: 'flex', justifyContent:'center'}}>
                                <div className='col-md-9 col-sm-12 accountButton' style={{display: 'flex', justifyContent:'center', width:'70%'}}>
                                    <button type="submit" className=' detailsButton' onClick={() => handleSave()} > Save Changes </button> 
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    {/* <div className='section'>
                        <div className='editDetailsHeader container'>
                            <h2>Customisation</h2>
                        </div>
                        <div>
                            <button id="tooltipEnable">Enable Tooltips</button>
                            <button id="tooltipDisable">Disable Tooltips</button>
                        </div>
                    </div> */}
                    <div className="accountButtonsSection row section">
                        <div className='col-md-6 col-sm-12 accountButton'>
                            <button className='logOutBtn' onClick={() => handleLogOut()}>Log Out</button>
                        </div>
                        <div className='col-md-6 col-sm-12 accountButton'>
                            <button className='deleteAccountBtn' onClick={() => handleDeleteAccount()}>Delete Account</button>
                        </div>
                        <p style={{fontSize:'0.7rem', color:'#a7a7a7', textAlign:'center'}}>GUIDANCE: Please be aware that deleting your account will also remove all of your projects, images and tracks from the database. This operation cannot be undone!</p>

                    </div>
                    {playerOn && <div className='player-block'></div>}
                </div>
            </div>
        </div>
    )
}

export default Account
