import { useState } from "react";
import { socket } from "../../../App";
import classes from "./ToggleButton.module.css";

const ToggleButton = () => {
  const [toggle, setToggle] = useState(true);

  const toggling = () => {
    setToggle(!toggle);
    if (toggle) {
      socket.emit("toggleON");
    } else {
      socket.emit("toggleOFF");
    }
  };
  return <button onClick={toggling}>{toggle ? "on" : "off"}</button>;
};

export default ToggleButton;
