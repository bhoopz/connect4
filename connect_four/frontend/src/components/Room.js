import React, {useState} from "react";
import { useEffect } from "react";
import { render } from "react-dom";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { makeStyles } from '@material-ui/styles';



export default function Room(props) {
  
    let params = useParams();
    let history = useHistory();
    const [gameTime, setGameTime] = useState('00:00:00');
    const [isHost, setIsHost] = useState(false);
    const defaultBoard = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
    var [board, setBoard] = useState(defaultBoard);
    const ROWS = 6
    const COLUMNS = 7
    const [playerTurn, setPlayerTurn] = useState(getPlayerTurn(1,2));
    const player1 = 1
    const player2 = 2

    if(!history.location.state || !history.location.state.nick){
        return <Redirect to ="/player/join/" />
    }
    const getRoomDetails = () => {
        fetch('/player/get-room' + '?code=' + params.roomCode)
        .then((response) => response.json())
        .then((data) => {
            setGameTime(data.game_time),
            setIsHost(data.is_host)         
            var temp = stringConverter(data.board)
            setBoard(temp)
        });
    }

    

    function getPlayerTurn(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function stringConverter(str) {
      str = str.split('\n').join(',')
      str = str.split('.').join(',')
      str = str.split(',]').join(']')
      return JSON.parse(str)
    }

    const roomCode = params.roomCode
    const nick = history.location.state.nick

      const roomSocket = new WebSocket(
        "ws://" + window.location.host + "/ws/player/room/" + roomCode + "/"
      );

      roomSocket.onopen = function (e) {
        console.log(roomSocket);
      };

      roomSocket.onclose = function (e) {
        console.error("Chat socket closed");
      };

      
      const sendMsg = function(){ 
        document.querySelector("#chat-message-submit").onclick = function (e) {
            const messageInputDom = document.querySelector("#chat-message-input");
            const message = messageInputDom.value;
            if(message != ""){
                roomSocket.send(
              JSON.stringify({
                message: message,
                nick: nick,
              })
            );
            messageInputDom.value = "";
          };}
    };
      

    useEffect(() => {
        roomSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            if(data.message != undefined){
              document.querySelector("#chat-log").value += data.nick + ": " + data.message + "\n";
              
            }
            if(data.board != undefined){
              setBoard(data.board)
            }
          };
          getRoomDetails()
          sendMsg()
      }, [])

      const renderSquare = function(i){
        if(displayValue(i) == 1){
            return <button className="squareone" value={i} key={i} onClick={makeMoveButtonClick} ></button>
        } else if(displayValue(i) == 2){
            return <button className="squaretwo" value={i} key={i} onClick={makeMoveButtonClick}></button>
        } else{
            return(
          <button className="square" value={i} key={i} onClick={makeMoveButtonClick}></button>)
        }
      }

  const displayValue = function(i){
      var temp = 5 - ~~(i/7)
      var value = board[temp][i % 7]
      return value
  }

  const rowChange = function(board, column){
    for(var row=0; row<6; row++){
        if(board[row][column] == 0){ return row}
    }
}

const correctRow = function(board, column){
    return board[5][column]
}

const makeMove = function(board, column, row, player){
    const temp = JSON.parse(JSON.stringify(board))
    temp[row][column] = player
    setBoard(temp)
    roomSocket.send(
      JSON.stringify({
        board : temp,
      }));
    return temp
    
}

const playerMove = function(board, column, player){
        var row = rowChange(board, column)
        var temp = makeMove(board, column, row, player)
        setBoard(temp)
        return temp
}

function updateServerBoard(){
  const requestOptions= {
    method: 'POST',
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify({ 
        board: board,
        code: roomCode,
    })
};
fetch("/player/get-room", requestOptions).then((response) =>{response})
}

const makeMoveButtonClick = function(event){
          if(playerTurn == 1){
            var column = event.target.value % 7;
            var temp = playerMove(board, column, player1)
            setBoard(temp)
            setPlayerTurn(2)
            updateServerBoard()
          }else{
            var column = event.target.value % 7;
            var temp = playerMove(board, column, player2)
            setBoard(temp)
            setPlayerTurn(1)
            updateServerBoard()
          }
            
}


    return (<div id="container">
              <Grid container spacing={6} direction="column" justifyContent="center" alignItems="center">   
                <Grid item xs={4}>
                  <Typography component="h3" variant="h3">
                    Connect 4
                  </Typography>
                </Grid>
        
              <Grid item xs="auto">
                  <div id="content">
                    <Grid container spacing={6} direction="row" justifyContent="space-between" alignItems="center" style={{ background: '#555'}}>
                        <Grid item xs style={{ background: '#999'}}>
                            <textarea readOnly="readOnly" id="chat-log" cols="30" rows="20"></textarea><br />
                            <input id="chat-message-input" type="text" size="31" /><br />
                            <input id="chat-message-submit" type="button" value="Send" />
                        </Grid>
                        <Grid item xs={6} style={{ alignItems: 'center' }}>
                          <div className="board">
                              {[...new Array(ROWS)].map((x, rowIndex) => {
                                return (
                                  <div className="board-row" key={rowIndex}>
                                      {[...new Array(COLUMNS)].map((y, colIndex) => renderSquare(rowIndex*COLUMNS + colIndex) )}
                                  </div>)
                                })}
                          </div>    
                        </Grid>
                        <Grid item xs style={{ background: '#999'}}>
                          <p>{gameTime}</p>
                        </Grid>  
                    </Grid>        
                  </div>
              </Grid>

              <Grid item xs={2}>
                <h1>{"FUTER"}</h1>
              </Grid>
      </Grid>
  </div>);
}

