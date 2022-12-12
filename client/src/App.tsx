import classes from './App.module.css';
import { io } from "socket.io-client";
import Board from './components/Board';
import JoinForm from './components/JoinForm';
import ToggleButton from './components/Layout/ToggleButton';

// generates authentication code.
function generateCode(length: number) {
  let result = "";
  let characters = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

if(!localStorage.getItem("auth")){
  localStorage.setItem("auth", generateCode(10))
}

export const socket = io("ws://localhost:3001", {auth: {token:localStorage.getItem("auth")}});

socket.onAny((eventName, ...args) => {
  console.log({type: eventName, data: args});
});

function App() {
  return (
    <div className={classes.app}>
      <Board/>
      <JoinForm/>
      <ToggleButton/>
    </div>
  );
}

export default App;
