import React from 'react'
import '../css/ContentManagement.css'
import { MdAddPhotoAlternate } from "react-icons/md"
import { FaTrashAlt } from "react-icons/fa";
import { ImCross } from "react-icons/im";



function AlbumManagement({clickOff, edit, mode, setMode}) {

    function handleClick() {
        const input = document.getElementsByClassName('management-input')[0];
        input.click();
    }


    return (
    <div className='album-manager-wrapper'>
        <div className='album-manager-click-off' onClick={() => {clickOff(false); setMode(false)}}></div>
        <div className='album-manager'>
            <div className='album-manager-header-wrapper'>
                <div className='album-manager-header'>
                    <h4>{edit ? 'Edit' : 'Create'} Album</h4>
                </div>
                <div className='album-manager-header-button-wrapper'>
                    <button className='album-manager-header-button' onClick={() => {clickOff(false); setMode(false)}}><span><ImCross/></span></button>
                </div>
            </div>
            <div className='album-manager-content'>
                <div className='album-manager-image-wrapper' >
                    <div className='album-manager-image-content'>
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
                        <input className="management-input" type="file" accept='image/jpg, image/png, image/jpeg, image/webp'/>
                        <div className='management-input-click-div'>
                            <button className='management-input-button' onClick={() => handleClick()}></button>
                        </div>
                    </div>
                </div>
                <div className='album-manager-entry-wrapper'>
                    <div className='album-manager-entry-content'>
                        <div className='album-manager-field-wrapper'>
                            <div className='label-wrapper'><label htmlFor="">Album Name</label></div>
                            <input className='album-entry' placeholder="What's your album title?"  data-bs-toggle="tooltip" data-bs-placement="top" title="This will be displayed in the menu and album page."></input>
                        </div>
                        <div className='album-manager-field-wrapper'>
                            <div className='label-wrapper'><label htmlFor="">Label</label></div>
                            <input className='album-entry' placeholder='Who is the publisher/label?'  data-bs-toggle="tooltip" data-bs-placement="top" title="This will be displayed at the bottom of the album page, below the music."></input>
                        </div>
                        <div className='album-manager-field-wrapper'>
                            <div className='label-wrapper'><label htmlFor="">Release Date</label></div>
                            <input className='album-entry' type='date' placeholder="What's your album release date?" data-bs-toggle="tooltip" data-bs-placement="top" title="This will be displayed next to the album title, and again at the bottom of album page, much like Spotfiy's interface."></input>
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
                        <button className='create-save-button' onClick={() => {clickOff(false); setMode(false)}}>{edit? 'Save' : 'Create'}</button>
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
