import React, {createContext, useState, useEffect, useContext} from "react";
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import Header from "./components/Header";
import Library from "./components/Library";
import "./css/App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Account from "./components/Account";
import Album from "./components/Album";
import Player from "./components/Player";
import ForgotPassword from "./components/ForgotPassword"
import { PlayerProvider } from "./contexts/PlayerContext";
import { PlayerContext } from "./contexts/PlayerContext";


function App() {
  const {playerOn} = useContext(PlayerContext);
  return(
      <Router>                            
        <Routes>                                                                       
          <Route exact path="/" element={<Welcome/>}/>
          <Route path="/CreateAccount" element={<CreateAccount/>}/>
          <Route path="/forgot-password" exact Component={ForgotPassword}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Library" element={<Library/>}></Route>
          <Route path="/Account" element={<Account/>}></Route>
          <Route path="/project/:key" exact Component={Album}></Route>
        </Routes>
        {playerOn && <Player/>}
      </Router>
  )
}

export default App;