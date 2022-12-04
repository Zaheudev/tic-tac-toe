import React from 'react';
import './App.css';
import { io } from "socket.io-client";
import Board from './components/Board';

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
    <div className="App" style={{display:"flex",justifyContent:"center"}}>
      <Board/>
    </div>
  );
}

export default App;
