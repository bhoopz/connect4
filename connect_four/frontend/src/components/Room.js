import React, {useState} from "react";
import { useEffect, useMemo } from "react";
import { render } from "react-dom";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Prompt } from 'react-router';




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
    const [open, setOpen] = useState(false);
    const [didPlayerJoin, setDidPlayerJoin] = useState(false)
    const [hostScore, setHostScore] = useState(0);
    const [playerScore, setPlayerScore] = useState(0);
    var [hostNickname, setHostNickname] = useState("")
    var [playerNickname, setPlayerNickname] = useState("")
    var [whoWonString, setWhoWonString] = useState("");
    const [ifPublic, setIfPublic] = useState(false)
  

    if(!history.location.state || !history.location.state.nick){
        return <Redirect to ="/player/join/" />
    }

    window.onbeforeunload = function(){
      userLeftPage();
  };

    const userLeftPage = () =>{
      if(isHost===false){
              var tempTime = convertTime(gameTime)
              var tempSeconds = convertSeconds(gameTime)
              setHostTime(tempTime)
              setHostSeconds(tempSeconds)
              setPlayerTime(tempTime)
              setPlayerSeconds(tempSeconds)
              setPlayerId("")
              roomSocket.send(
                JSON.stringify({
                  player_id: "",
                  host_time : tempTime,
                  host_seconds : tempSeconds,
                  player_time : tempTime,
                  player_seconds : tempSeconds,
                }))
                const requestOptions= {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json'},
                  body: JSON.stringify({ 
                      player_id: null,
                      board: defaultBoard,
                      code: roomCode,
                      host_time: gameTime,
                      player_time: gameTime
                  })
              };
              fetch("/player/get-room", requestOptions).then((response) =>props.history.push("/"))
            }else{
              roomSocket.send(
                JSON.stringify({
                  who_won_string: "Host left, room expired",
                }))
                const requestOptions = {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                };
                fetch("/player/leave-room", requestOptions).then((response) => props.history.push("/"))
            }
    }

    const getRoomDetails = () => {
        fetch('/player/get-room' + '?code=' + params.roomCode)
        .then((response) => response.json())
        .then((data) => {
            setGameTime(data.game_time),
            setIsHost(data.is_host)
            hostId = data.host_id 
            playerId = data.player_id
            decision = data.host_starts
            var temp = stringConverter(data.board)
            setBoard(temp)
            setDecision(decision)
            setHostTime(convertTime(data.host_time))
            setPlayerTime(convertTime(data.player_time))
            setHostSeconds(convertSeconds(data.host_time))
            setPlayerSeconds(convertSeconds(data.player_time))
            setPlayerId(data.player_id)
            if(data.player_id !== "" && data.player_id !== null){
              roomSocket.send(
                JSON.stringify({
                  player_id: playerId,
                }))
            }
            setHostNickname(data.host_nickname)
            setPlayerNickname(data.player_nickname)
            setIfPublic(data.public)
               
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
    


      const roomSocket =useMemo(()=> new WebSocket(
        "ws://" + window.location.host + "/ws/player/room/" + roomCode + "/"
      )
      ,[])

      roomSocket.onclose = function (e) {
        userLeftPage();
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
            if(data.player_id != undefined){
              setPlayerId(data.player_id)
            }
            if(data.who_won_string != undefined){
              setWhoWonString(data.who_won_string)
            }
            if(data.host_score != undefined){
              setHostScore(data.host_score)
            }
            if(data.player_score != undefined){
              setPlayerScore(data.player_score)
            }
            if(data.host_time != undefined){
              setHostTime(data.host_time)
            }
            if(data.host_seconds != undefined){
              setHostSeconds(data.host_seconds)
            }
            if(data.player_time != undefined){
              setPlayerTime(data.player_time)
            }
            if(data.player_seconds != undefined){
              setPlayerSeconds(data.player_seconds)
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

      useEffect(() => {
        if(playerId){
          playerJoined()
          
        }else{
          setDidPlayerJoin(false)
        }  
        getRoomDetails()
      },[playerId])

      let [myInterval, setMyInterval]= useState();

      useEffect(() => {
        if(isHost == true){
        if (hostSeconds === 0 && hostTime === 0) {  
              clearInterval(myInterval)
              var tempString = playerNickname + " WON!"
              var tempScore = playerScore + 1
              if(tempString !== " WON!"){
              roomSocket.send(
                JSON.stringify({
                  who_won_string : tempString,
                  player_score : tempScore,
                  host_time : hostTime,
                  host_seconds : hostSeconds,
                  player_time : playerTime,
                  player_seconds : playerSeconds,
                }));
              }
            }
            else if (playerSeconds === 0 && playerTime === 0) {         
                  clearInterval(myInterval)
                  var tempString = hostNickname + " WON!"
                  var tempScore = hostScore + 1
                  if(tempString !== " WON!"){
                    roomSocket.send(
                    JSON.stringify({
                      who_won_string : tempString,
                      host_score : tempScore,
                      host_time : hostTime,
                      host_seconds : hostSeconds,
                      player_time : playerTime,
                      player_seconds : playerSeconds,
                    }));
                  }                
              }else{
                if(didPlayerJoin==true){
                  roomSocket.send(
                    JSON.stringify({
                      host_time : hostTime,
                      host_seconds : hostSeconds,
                      player_time : playerTime,
                      player_seconds : playerSeconds,
                    }));
                }
               
              }
              
              
            }
            
      },[hostSeconds, playerSeconds])


    
      useEffect(()=>{
      if(!didPlayerJoin) return
        myInterval = setInterval(() => {
          
          if(didPlayerJoin && gameTime !== '00:00:00' && isHost == true){
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
      
}
      }, 1000)
          
            return ()=> {
                clearInterval(myInterval);
              };
        });

// useEffect(()=>{
//   return ()=>{
//     if(isHost===false){
//       roomSocket.send(
//         JSON.stringify({
//           player_id: "",
//         }))
//         const requestOptions= {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json'},
//           body: JSON.stringify({ 
//               player_id: null,
//               board: defaultBoard,
//               code: roomCode,
//           })
//       };
//       fetch("/player/get-room", requestOptions).then((response) =>{response})
//     }else{
//       roomSocket.send(
//         JSON.stringify({
//           who_won_string: "Host left, room expired",
//         }))
//         const requestOptions = {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//         };
//         fetch("/player/leave-room", requestOptions).then((response) => props.history.push("/"))
//     }
//   }
// },[])

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
    if(winningConditions(temp, player)){
      if(decision === true){
        var tempString = hostNickname + " WON!"
        var tempScore = hostScore + 1
        roomSocket.send(
          JSON.stringify({
            who_won_string : tempString,
            host_score : tempScore,
          }));
      }else{
        var tempString = playerNickname + " WON!"
        var tempScore = playerScore + 1
        roomSocket.send(
          JSON.stringify({
            who_won_string : tempString,
            player_score : tempScore,
          }));
      }    
    }
    if(drawCondition(temp)){
      var tempString = "DRAW!"
        roomSocket.send(
          JSON.stringify({
            who_won_string : tempString,
          }));
    }
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

const winningConditions = function(board, x){ 
  for(var y=0; y<7; y++){
      for(var z=0; z<3; z++){
          if(board[z][y] == x && board[z+1][y] == x && board[z+2][y] == x && board[z+3][y] == x) return true
      }
  }

  for(var y=0; y<4; y++){
      for(var z=0; z<6; z++){
          if(board[z][y] == x && board[z][y+1] == x && board[z][y+2] == x && board[z][y+3] == x) return true
      }
  }

  for(var y=0; y<4; y++){
      for(var z=3; z<6; z++){
          if(board[z][y] == x && board[z-1][y+1] == x && board[z-2][y+2] == x && board[z-3][y+3] == x) return true
      }
  }

  for(var y=0; y<4; y++){
      for(var z=0; z<3; z++){
          if(board[z][y] == x && board[z+1][y+1] == x && board[z+2][y+2] == x && board[z+3][y+3] == x) return true
      }
  }
}

const drawCondition = function(board){
  return board.every(row => row.every(cell => cell != 0))
}

const playerMove = function(board, column, player){
        var row = rowChange(board, column)
        var temp = makeMove(board, column, row, player)
        setBoard(temp)
        return temp
}



const makeMoveButtonClick = function(event){
        if(whoWonString===""){
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
    }



    const showTime = (timeMinutes, timeSeconds) => {
      return(<Grid item xs={12}>
        <h2>{gameTime ==="00:00:00" ? null : (timeSeconds < 10 ? (timeMinutes < 10 ? "0" + timeMinutes + ':' + "0" + timeSeconds  : timeMinutes  + ':' + "0" + timeSeconds) :
        (timeMinutes < 10 ? "0" + timeMinutes + ':' + timeSeconds : timeMinutes  + ':' + timeSeconds))}</h2>
      </Grid>)
    }

    

    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    const playerJoined = () => {
      setDidPlayerJoin(true)
    }

    const startNewGame = function(){
      setBoard(defaultBoard);
      var tempTime = convertTime(gameTime)
      var tempSeconds = convertSeconds(gameTime)
      var tempString =""
      setHostTime(tempTime)
      setHostSeconds(tempSeconds)
      setPlayerTime(tempTime)
      setPlayerSeconds(tempSeconds)
      roomSocket.send(
        JSON.stringify({
          who_won_string : tempString,
          board : defaultBoard,
          host_time : tempTime,
          host_seconds : tempSeconds,
          player_time : tempTime,
          player_seconds : tempSeconds,
        }));

        const requestOptions= {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          body: JSON.stringify({ 
              board: defaultBoard,
              code: roomCode,
          })
      };
      fetch("/player/get-room", requestOptions).then((response) =>{response})
  }


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
                                <h2>{whoWonString != "" ? whoWonString : whoseMoveString}</h2> 
                          </div> 
                            
                        </Grid>
                        <Grid container item xs spacing={6} direction="column" justifyContent="center" style={{ background: '#000'}}>  
                        <Grid item xs={4} style={{ background: '#333'}}>
                              {hostNickname}
                              <h1>{hostScore}</h1>
                        </Grid> 
                        <Grid item xs={4} style={{ background: '#999'}}>
                          {showTime(hostTime, hostSeconds)}
                          {showTime(playerTime, playerSeconds)}
                          {isHost==true ? <Button color="primary" variant="contained"  onClick={startNewGame} disabled={whoWonString==""}>New game</Button> : null}
                        </Grid>  
                        <Grid item xs={4} style={{ background: '#333'}}>
                              {playerNickname}
                              <h1>{playerScore}</h1>
                        </Grid> 
                  
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

              <Dialog
                open={!didPlayerJoin}
                onClose={playerJoined}
                aria-labelledby="alert-dialog-title"
                fullScreen
              >
                <DialogTitle id="alert-dialog-title" textAlign="center">                  
                <Typography component={'span'} variant="h3">Waiting for the player to join</Typography>
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description" textAlign="center">
                  {ifPublic==false ? (<Typography component={'span'} variant="h3">Your room code:<br></br></Typography>) : null}
                  {ifPublic==false ? (<Typography component={'span'} variant="h2"><b>{roomCode}</b></Typography>) : null}
                 
                
                </DialogContentText>
              </DialogContent>
              </Dialog>

              <Grid item xs={2}>
                <p>{isHost.toString()}</p>
                <Button color="secondary" variant="contained" onClick={userLeftPage}>Leave the Game</Button>
              </Grid>
      </Grid>
  </div>);
}

