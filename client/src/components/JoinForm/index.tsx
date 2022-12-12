import classes from "./JoinForm.module.css";

import { useEffect, useState } from "react";
import { socket } from "../../App";


function JoinForm() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    socket.on("error", (...args) => {
      console.log("error");
    });
    return () => {
      socket.off('error');
    }
  });
  
  const onChangeCode = (e:any) => {
    setCode(e.target.value);
  }

  const onChangeName = (e:any) => {
    setName(e.target.value);
  }

  const sendData = () => {
    socket.emit("JoinRoom", {name: name, code: code});
  }

  const leaveRooom = () => {
    socket.emit("leaveRoom");
  };

  return (
    <div className={classes.container}>
      <input placeholder="name" onBlur={onChangeName} />
      <input placeholder="room code" onBlur={onChangeCode} />
      <button onClick={sendData}>Join a Room</button>
      <button onClick={leaveRooom}>Leave current Room</button>
    </div>
  );
}

export default JoinForm;
