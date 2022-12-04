import { socket } from "../App";

import classes from './Board.module.css';

function Board() {

  const selectCell = (event:any) => {
    socket.emit("makeMove", event.target.id);
  }

  socket.on("updateBoard", (...args) => {
    updateData(args[0].game.board);
  })

  const updateData = (array: any[]) => {
    array.forEach((value, index) => {
      let cell = document.getElementById(index.toString());
      if(cell){
        if(typeof value === 'string'){
          cell.innerHTML = value;
        }else {
          cell.innerHTML = "";
        }
      }
    });
  }
 
  return (
    <table className={classes.table}>
      <tbody onClick={selectCell}>
        <tr>
          <td id="0" style={{borderTop:0, borderLeft: 0}}></td>
          <td id="1" style={{borderTop:0}}></td>
          <td id="2" style={{borderTop:0, borderRight: 0}}></td>
        </tr>
        <tr>
          <td id="3" style={{borderLeft: 0}}></td>
          <td id="4"></td>
          <td id="5" style={{borderRight: 0}}></td>
        </tr>
        <tr>
          <td id="6" style={{borderLeft: 0, borderBottom: 0}}></td>
          <td id="7" style={{borderBottom: 0}}></td>
          <td id="8" style={{borderRight: 0, borderBottom: 0}}></td>
        </tr>
      </tbody>
    </table>
  );
}

export default Board;
