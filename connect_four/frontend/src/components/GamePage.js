import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { useParams, Link } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'



export default function GamePage(props){

    const defaultBoard = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
    var [board, setBoard] = useState(defaultBoard);
    let params = useParams()
    var [player, setPlayer] = useState(1)
    var [bot, setBot] = useState(2)
    var [depth, setDepth] = useState(3)
    const [show, setShow] = useState(false);
    const [body, setBody] = useState("")
    const [gameSocket, setGameSocket] = useState(new WebSocket(
        "ws://" + window.location.host + "/ws" + props.location.pathname + "/"
      ))
    const ROWS = 6
    const COLUMNS = 7

    const specifyDepth = function(){
        if(props.location.pathname === "/computer/easy"){
            depth = 1
        }else if(props.location.pathname === "/computer/medium"){
            depth = 3
        }else if(props.location.pathname === "/computer/hard"){
            depth = 5
        }
    }
    
    

    const startNewGame = function(){
        setBoard(defaultBoard);
        setShow(false);
    }

    const changeOrder = function(){ 
        board = defaultBoard 
        setBoard(board)    
        if(player === 1){ 
            const playerTemp = 2
            const botTemp = 1
            setPlayer(playerTemp)
            setBot(botTemp)
            gameSocket.send(
                JSON.stringify({
                  board: board,
                  depth: depth,
                  player: playerTemp,
                  bot: botTemp,
                })
              );
        }else{ 
            const playerTemp = 1
            const botTemp = 2
            setPlayer(playerTemp)
            setBot(botTemp)
        }
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

    
    const rowChange = function(board, column){
        for(var row=0; row<6; row++){
            if(board[row][column] == 0){ return row}
        }
    }

    const correctRow = function(board, column){
        return board[5][column]
    }

    const makeMove = function(board, column, row, player){
        if(!show){
        const temp = JSON.parse(JSON.stringify(board))
        temp[row][column] = player
        setBoard(temp)
        gameSocket.send(
            JSON.stringify({
              board: temp,
              depth: depth,
              player: player,
              bot: bot,
            })
          );}
    }

    const playerMove = function(board, column, player){
            var row = rowChange(board, column)
            makeMove(board, column, row, player)
    }
    
    


    useEffect(() => {
        specifyDepth();
        gameSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const boardTemp = data.board
            setBoard(boardTemp)
            
            if(winningConditions(boardTemp, bot)){
                console.log("wchodzi")
                setShow(true)
                setBody("Unfortunately, computer won! Try once again")
            }
          };
             
      }, [board,bot, player])

    //   useEffect(() => {
        
    //   }, [board, bot, player])



    const sendData = function(event){ 
            var column = event.target.value;
            playerMove(board, column, player)
            if(winningConditions(board, player)){
                setBody("Congratulations, you won!")
                setShow(true)
            }
    };

    const leaveButtonClick = () => {
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
        };
        fetch('/computer/leave-game', requestOptions).then((_response) => {props.history.push('/')})
    }


      gameSocket.onclose = function (e) {
        console.error("Game socket closed");
      };


    return (
        <Grid container spacing={1} align="center">
        {/* <div>
              {[...new Array(rows)].map((x, rowIndex) => {
                return (
                  <div className="board-row" key={rowIndex}>
                    {[...new Array(columns)].map((y, colIndex) => renderSquare(rowIndex*columns + colIndex) )}
                  </div>
                  
                  
                )
              })
              }
        </div> */}
            {<div>{board}</div>}
            

        <Grid item xs={12}>
            {<div>
                <input id="btn" type="button" onClick={sendData} value={0} />    
                <input id="btn" type="button" onClick={sendData} value={1} />   
                <input id="btn" type="button" onClick={sendData} value={2} />   
                <input id="btn" type="button" onClick={sendData} value={3} />   
                <input id="btn" type="button" onClick={sendData} value={4} />   
                <input id="btn" type="button" onClick={sendData} value={5} />   
                <input id="btn" type="button" onClick={sendData} value={6} />  
            </div>}
        </Grid>
        <Grid item xs={12}>
            <Button color="primary" variant="contained" onClick={changeOrder}>Switch Move Order</Button>
            <Button color="secondary" variant="contained" onClick={leaveButtonClick}>Leave the Game</Button>
        </Grid>
        
            <Modal show={show} onHide={startNewGame} backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Game Ended</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {body}
                </Modal.Body>
                <Modal.Footer>
                    <Button color="primary" variant="contained" onClick={startNewGame}>New Game</Button>
                    <Button color="secondary" variant="contained" to="/computer/" component={Link}>Change Computer Level</Button>
                </Modal.Footer>
            </Modal>
        
            
        </Grid>)
}