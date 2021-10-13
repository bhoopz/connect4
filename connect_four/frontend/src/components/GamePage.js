import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { useParams } from "react-router-dom";


export default function GamePage(props){

    const rows = 6
    const columns = 7
    const [data, setData] = useState([]);
    const [board, setBoard] = useState([[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,0,0,0,0,0,0]]);
    let params = useParams()
    

    useEffect(() => {
        async function fetchMyAPI() {
          let response = await fetch('/computer/get-game')
          response = await response.json()
          setBoard(JSON.parse(JSON.stringify(response.board)))

        }

        fetchMyAPI()
        
      }, [])


    var temp = -1
    function renderSquare(i)  {
        
        if(temp2===0){temp++}
        return <button className="square" name="kolumna" value={i} onClick={handleButtonClick}>{i}</button>;   
    }

    

    const handleButtonClick = (e) => {
        const column = e.target.value
        console.log(board, column)
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                column: column,
                board: board,
            })
        };
        fetch('/computer/get-game', requestOptions)
        .then(response => response.json())
        .then(data => data);
    }

    const leaveButtonClick = () => {
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
        };
        fetch('/computer/leave-game', requestOptions).then((_response) => {props.history.push('/')})
    }
    
    const test = JSON.parse(JSON.stringify(data))
    const tablica = test.board
    
    console.log(typeof board)    


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
                <button className="square" name="kolumna" value={0} onClick={handleButtonClick}>{0}</button>
                <button className="square" name="kolumna" value={1} onClick={handleButtonClick}>{1}</button>
                <button className="square" name="kolumna" value={2} onClick={handleButtonClick}>{2}</button>
                <button className="square" name="kolumna" value={3} onClick={handleButtonClick}>{3}</button>
                <button className="square" name="kolumna" value={4} onClick={handleButtonClick}>{4}</button>
                <button className="square" name="kolumna" value={5} onClick={handleButtonClick}>{5}</button>
                <button className="square" name="kolumna" value={6} onClick={handleButtonClick}>{6}</button>     
            </div>}
        </Grid>
        <Grid item xs={12}>
            <Button color="secondary" variant="contained" onClick={leaveButtonClick}>Leave the Game</Button>
        </Grid>
            
        </Grid>)
}