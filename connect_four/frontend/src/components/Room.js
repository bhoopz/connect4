import React, {useState} from "react";
import { useEffect } from "react";
import { render } from "react-dom";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';




export default function Room(props) {
  
    let params = useParams();
    let history = useHistory();
    const [gameTime, setGameTime] = useState('00:00:00');
    var [isHost, setIsHost] = useState(false);
    var [hostId, setHostId] = useState("");
    var [playerId, setPlayerId] = useState("");
    const defaultBoard = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
    var [board, setBoard] = useState(defaultBoard);
    var [whoseMoveString, setWhoseMoveString] = useState("");
    const ROWS = 6
    const COLUMNS = 7
    var [decision, setDecision] = useState(false)
    const [hostTime, setHostTime] = useState(0);
    const [hostSeconds, setHostSeconds ] =  useState(0);
    const [playerTime, setPlayerTime] = useState(0);
    const [playerSeconds, setPlayerSeconds ] =  useState(0);


    if(!history.location.state || !history.location.state.nick){
        return <Redirect to ="/player/join/" />
    }

    const getRoomDetails = () => {
        fetch('/player/get-room' + '?code=' + params.roomCode)
        .then((response) => response.json())
        .then((data) => {
            setGameTime(data.game_time),
            setIsHost(data.is_host)
            hostId = data.host_id 
            setPlayerId(data.player_id)
            decision = data.host_starts
            var temp = stringConverter(data.board)
            setBoard(temp)
            setDecision(decision)
            setHostTime(convertTime(data.host_time))
            setPlayerTime(convertTime(data.player_time))
            setHostSeconds(convertSeconds(data.host_time))
            setPlayerSeconds(convertSeconds(data.player_time))      
        });
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
            if(data.decision != undefined){
              setDecision(data.decision)
            }
          };
          setUpString()
          getRoomDetails()
          sendMsg()    
      }, [])

      useEffect(() => {
        convertTime(gameTime)
      }, [gameTime])

      useEffect(() => {
        setUpString()
      }, [decision, isHost])

      
      useEffect(()=>{
        
        let myInterval = setInterval(() => {
          if(decision === true){
                if (hostSeconds > 0) {
                    setHostSeconds(hostSeconds - 1);
                }
                if (hostSeconds === 0) {
                    if (hostTime === 0) {
                        clearInterval(myInterval)
                    } else {
                        setHostTime(hostTime - 1);
                        setHostSeconds(59);
                    }
                }
                var timeString = changeTimeString(hostTime, hostSeconds)
                const requestOptions= {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json'},
                  body: JSON.stringify({ 
                      host_time: timeString,
                      code: roomCode,
                  })
              };
              fetch("/player/get-room", requestOptions).then((response) =>{response})
        }
        if(decision === false){

          if (playerSeconds > 0) {
              setPlayerSeconds(playerSeconds - 1);
          }
          if (playerSeconds === 0) {
              if (playerTime === 0) {
                  clearInterval(myInterval)
              } else {
                  setPlayerTime(playerTime - 1);
                  setPlayerSeconds(59);
              }
          } 
          var timeString = changeTimeString(playerTime, playerSeconds)
          const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                player_time: timeString,
                code: roomCode,
            })
        };
        fetch("/player/get-room", requestOptions).then((response) =>{response})
  }
      
      
      }, 1000)
          
            return ()=> {
                clearInterval(myInterval);
              };
        });


      function changeTimeString(xMinutes, xSeconds){
        if(xMinutes < 10){
          if(xSeconds < 10){
            var timeString = "00:0"+xMinutes+":0"+xSeconds
          }else{
            var timeString = "00:0"+xMinutes+":"+xSeconds
          }
        }else{
          if(hostSeconds < 10){
            var timeString = "00:"+xMinutes+":0"+xSeconds
          }else{
            var timeString = "00:"+xMinutes+":"+xSeconds
          }
        }
        return timeString;
      }


      function convertTime(gameTime) {
        var timeArray = gameTime.split(':')
        var minutes =parseInt(timeArray[1])
        return minutes

      }

      function convertSeconds(gameTime) {
        var timeArray = gameTime.split(':')
        var seconds =parseInt(timeArray[2])
        return seconds

      }


      function setUpString(){
        if(decision === true && isHost === true){
          setWhoseMoveString("Your move")
        }else if(decision === true && isHost === false){
          setWhoseMoveString("Opponent's move")
        }else if(decision === false && isHost === true){
          setWhoseMoveString("Opponent's move")
        }else if(decision === false && isHost === false){
          setWhoseMoveString("Your move")
        }
      }


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
    var tempDecision = !decision
    setDecision(tempDecision)
    roomSocket.send(
      JSON.stringify({
        board : temp,
        decision : tempDecision,
      }));
      const requestOptions= {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ 
            board: temp,
            code: roomCode,
            decision: tempDecision,
        })
    };
    fetch("/player/get-room", requestOptions).then((response) =>{response})
    return temp
    
}

const playerMove = function(board, column, player){
        var row = rowChange(board, column)
        var temp = makeMove(board, column, row, player)
        setBoard(temp)
        return temp
}


const makeMoveButtonClick = function(event){
          if(decision === true){
              if(isHost === true){
                if(whoseMoveString==="Your move"){
                  var column = event.target.value % 7;
                  var temp = playerMove(board, column, 1)
                  setBoard(temp)  
                }else{
                  handleClickOpen()
                }          
                

              }else{
                if(whoseMoveString==="Your move"){
                  var column = event.target.value % 7;
                  var temp = playerMove(board, column, 1)
                  setBoard(temp)
                }else{
                  handleClickOpen()
                } 
              }        
          }else{
              if(isHost === true){
                if(whoseMoveString==="Your move"){
                  var column = event.target.value % 7;
                  var temp = playerMove(board, column, 2)
                  setBoard(temp)
                }else{
                  handleClickOpen()
                }
              }else{
                if(whoseMoveString==="Your move"){
                  var column = event.target.value % 7;
                  var temp = playerMove(board, column, 2)
                  setBoard(temp)
                }else{
                  handleClickOpen()
                }
          }
            
  }
}

    function leaveRoom(){
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      };
      fetch("/player/leave-room", requestOptions).then((response) => props.history.push("/"))
      
    }

    const showTime = (timeMinutes, timeSeconds) => {
      return(<Grid item xs={12}>
        <h2>{timeMinutes === 0 && timeSeconds ===0 ? null : (timeSeconds < 10 ? (timeMinutes < 10 ? "0" + timeMinutes + ':' + "0" + timeSeconds  : timeMinutes  + ':' + "0" + timeSeconds) :
        (timeMinutes < 10 ? "0" + timeMinutes + ':' + timeSeconds : timeMinutes  + ':' + timeSeconds))}</h2>
      </Grid>)
    }

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };


    return (
            <div id="container">
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
                                <h2>{whoseMoveString}</h2> 
                          </div> 
                            
                        </Grid>
                        <Grid item xs style={{ background: '#999'}}>
                          {showTime(hostTime, hostSeconds)}
                          {showTime(playerTime, playerSeconds)}
                        </Grid>  
                    </Grid>        
                  </div>
              </Grid>

              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Wait for the opponent's move!"}
                </DialogTitle>
                <DialogActions>
                  <Button onClick={handleClose} autoFocus>
                    Understood
                  </Button>
                </DialogActions>
              </Dialog>

              <Grid item xs={2}>
                <p>{isHost.toString()}</p>
                <Button color="secondary" variant="contained" onClick={leaveRoom}>Leave the Game</Button>
              </Grid>
      </Grid>
  </div>);
}

