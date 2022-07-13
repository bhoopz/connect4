import React, { useState, useEffect, useMemo } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { useParams, Link, Redirect } from "react-router-dom";
import Modal from 'react-bootstrap/Modal'
import { Prompt } from 'react-router'



export default function GamePage(props){

    const defaultBoard = [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]
    var [board, setBoard] = useState(defaultBoard);
    let params = useParams()
    var [player, setPlayer] = useState(1)
    var [bot, setBot] = useState(2)
    var [depth, setDepth] = useState(3)
    const [body, setBody] = useState("")
    const ROWS = 6
    const COLUMNS = 7
    const [squares, setSquares] = useState(Array(ROWS*COLUMNS))
    const [playerTurn, setPlayerTurn] = useState(true)

    const gameSocket = useMemo(()=> new WebSocket(
        "ws://" + window.location.host + "/ws" + props.location.pathname + "/"
      )
      ,[])

    const specifyDepth = function(){
        if(props.location.pathname === "/computer/easy"){
            depth = 1
        }else if(props.location.pathname === "/computer/medium"){
            depth = 3
        }else if(props.location.pathname === "/computer/hard"){
            depth = 5
        }
    }
    
    const classes = {
        root: {
          flexGrow: 1
        }};

    const startNewGame = function(){
        setBoard(defaultBoard);
        setBody("");
    }

    const changeOrder = function(){ 
        board = defaultBoard 
        setBoard(board)  
        setBody("")
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


    const makeMove = function(board, column, row, player){
        if(body==""){
        const temp = JSON.parse(JSON.stringify(board))
        temp[row][column] = player
        setBoard(temp)
        setPlayerTurn(false)
        if(!winningConditions(temp, player)){
        gameSocket.send(
            JSON.stringify({
              board: temp,
              depth: depth,
              player: player,
              bot: bot,
            })
          );
        }
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
            setPlayerTurn(true)
            if(winningConditions(boardTemp, bot)){
                setBody("Unfortunately, computer won! Try once again")
            }else if(drawCondition(boardTemp)){
                setBody("Draw, but it was good game!")
            }
          };
             
      }, [board,bot, player])




    const sendData = function(event){ 
        if(body=="" && playerTurn==true){
            var column = event.target.value % 7;
            var temp = playerMove(board, column, player)
            setBoard(temp)
            if(winningConditions(temp, player)){
                setBody("Congratulations, you won!")
            }else if(drawCondition(board)){
                setBody("Draw, but it was good game!")
            }
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


    return (<div style={classes.root}>
        <Grid container spacing={2} align="center">
            <Grid item xs={12}>
                <Typography component="h3" variant="h3">
                        Connect 4 
                </Typography>
            </Grid>
            
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
                        <h1>{body}</h1>
                    </div>
                    
                </Grid>
                <Grid container spacing={2} justifyContent='space-between'>
                <Grid item xs={12}>
                    <Button style={{marginRight: 20, borderRadius: 15, maxWidth: 300, minWidth: 150, width: "25%", fontSize: "min(max(10px, 2vw), 16px)"}} color="primary" variant="contained" onClick={startNewGame}>New Game</Button>
                    <Button style={{marginLeft: 40, borderRadius: 15, maxWidth: 300, minWidth: 150, width: "25%", fontSize: "min(max(10px, 2vw), 16px)"}} color="primary" variant="contained" onClick={changeOrder}>Switch Move Order</Button>         
                </Grid>
            
            <Grid item xs={12}>           
                <Button style={{marginRight: 20, borderRadius: 15, maxWidth: 300, minWidth: 150, width: "25%", fontSize: "min(max(8px, 2vw), 16px)"}} color="secondary" variant="contained" to="/" component={Link}>Leave the Game</Button>
                <Button style={{marginLeft: 40, borderRadius: 15, maxWidth: 300, minWidth: 150, width: "25%", fontSize: "min(max(8px, 2vw), 16px)"}} color="secondary" variant="contained" to="/computer/" component={Link}>Change Computer Level</Button>
            </Grid> 
            </Grid>
            
        </Grid>
        </div>
        
        )
        
}

