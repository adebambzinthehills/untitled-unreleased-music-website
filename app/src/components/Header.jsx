import React , {useEffect, useState} from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link , useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { MdAccountCircle } from "react-icons/md";
import { IoSettingsSharp } from "react-icons/io5";
import '../css/Header.css';

function Header({colour}) {

    const navigate = useNavigate();

    function toAccount(){
        navigate("/account");
    }

    function toSettings(){
        navigate("/settings")
    }


    const [headerColour, setHeaderColour] = useState(colour);
    useEffect(() => {
        setHeaderColour(colour)
    }, [colour])

    return (
        <div className='header' style={headerColour}>
            <div className='header-content'>
                <div className='left'>
                    <Link to="/library"><h3>Preview</h3></Link>
                </div>
                <div className='right'>
                    <div className='headerIcon'>
                        <button className='settingsLinkButton' onClick={() => toSettings()}><IoSettingsSharp/></button>
                    </div>
                    <div className="headerIcon"> 
                        <button className='accountLinkButton' onClick={() => toAccount()}><MdAccountCircle/></button>
                    </div>
                </div>
            </div>
            <div className='header-block'></div>
        </div>
    )
}

export default Header
