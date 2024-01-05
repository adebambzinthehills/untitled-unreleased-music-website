import React from "react";
import Login from "./components/Login";
import Header from "./components/Header";
import "./css/App.css";

function App() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  let display;
  if (loggedIn) {
    display = <Header loggedIn={loggedIn} setLoggedIn={setLoggedIn}>You are logged in.</Header>;
  }
  else{
    display = <Login loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>
  }

  return (
    <div className="App">
      {display}
    </div>
  );
}

export default App;