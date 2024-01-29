import React, {useState, useEffect, useContext} from "react";
import {Routes, Route, BrowserRouter as Router} from 'react-router-dom';
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import CreateAccount from "./components/CreateAccount";
import Header from "./components/Header";
import Library from "./components/Library";
import "./css/App.css";
import { AuthProvider } from "./contexts/AuthContext";
import Account from "./components/Account";
import Settings from "./components/Settings";
import Album from "./components/Album";

function App() {
  const [playerEnabled , setPlayerEnabled] = useState(false)

  if(playerEnabled){
    alert("You have enabled the player!");
    setPlayerEnabled(false);
  }


  return(
    <AuthProvider>
      <Router>                            
        <Routes>                                                                       
          <Route exact path="/" element={<Welcome/>}/>
          <Route path="/CreateAccount" element={<CreateAccount/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Library" element={<Library player={setPlayerEnabled}/>}></Route>
          <Route path="/Account" element={<Account player={setPlayerEnabled}/>}></Route>
          <Route path="/Settings" element={<Settings player={setPlayerEnabled}/>}></Route>
          <Route path="/Album" element={<Album player={setPlayerEnabled}/>}></Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;