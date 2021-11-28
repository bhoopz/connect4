import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { useParams, Link, Redirect } from "react-router-dom";
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
    const [squares, setSquares] = useState(Array(ROWS*COLUMNS))

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
        setShow(false);  
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

    const drawCondition = function(board){
        return board.every(row => row.every(cell => cell != 0))
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
          );
          return temp
        }
    }

    const playerMove = function(board, column, player){
            var row = rowChange(board, column)
            var temp = makeMove(board, column, row, player)
            setBoard(temp)
            return temp
    }
    
    


    useEffect(() => {
        specifyDepth();
        gameSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            const boardTemp = data.board
            setBoard(boardTemp)
            if(winningConditions(boardTemp, bot)){
                setShow(true)
                setBody("Unfortunately, computer won! Try once again")
            }else if(drawCondition(boardTemp)){
                setShow(true)
                setBody("Draw, but it was good game!")
            }
          };
             
      }, [board,bot, player])




    const sendData = function(event){ 
            var column = event.target.value % 7;
            var temp = playerMove(board, column, player)
            setBoard(temp)
            if(winningConditions(temp, player)){
                setBody("Congratulations, you won!")
                setShow(true)
            }else if(drawCondition(board)){
                setShow(true)
                setBody("Draw, but it was good game!")
            }
    };


      gameSocket.onclose = function (e) {
        console.error("Game socket closed");
      };

      const renderSquare = function(i){
          if(displayValue(i) == 1){
              return <button className="squareone" key={i} value={i} onClick={sendData}></button>
          }else if(displayValue(i) == 2){
            return <button className="squaretwo" key={i} value={i} onClick={sendData}></button>
          }
          else{
        return(
            <button className="square" key={i} value={i} onClick={sendData}></button> 
        )
          }
    }

    const displayValue = function(i){
        var temp = 5 - ~~(i/7)
        var value = board[temp][i % 7]
        return value
    }


    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <div className="board">
                    {[...new Array(ROWS)].map((x, rowIndex) => {
                        return (
                        <div className="board-row" key={rowIndex}>
                            {[...new Array(COLUMNS)].map((y, colIndex) => renderSquare(rowIndex*COLUMNS + colIndex) )}
                        </div>
                        
                        
                        )
                    })
                    }
                </div>
            </Grid>
            
        <Grid item xs={12}>
            <Button color="primary" variant="contained" onClick={changeOrder}>Switch Move Order</Button>
        </Grid>
        <Grid item xs={12}>
            <Button color="secondary" variant="contained" to="/" component={Link}>Leave the Game</Button>
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
        
            
        </Grid>
        
        )
}

