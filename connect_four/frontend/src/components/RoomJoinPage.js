import React, { Component } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { Link } from "react-router-dom";

export default function RoomJoinPage(props) {

    const [roomCode, setRoomCode] = React.useState("");
    const [error, setError] = React.useState("");
    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value)
    }

    const handleJoinRoomButtonClick= () => {
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                code: roomCode,
            })
        };
        fetch("/player/join-room", requestOptions).then((response) => {
            if(response.ok){
                props.history.push(`/player/room/${roomCode}`)
            }else{
                setError("Room not found :(")
            }
        })
    }


    return (
    <Grid container spacing={1} align="center">
        <Grid item xs={12}>
            <Typography component="h4" variant="h4">
                Join the Room
            </Typography>
        </Grid>
        <Grid item xs={12} >
            <FormControl component="fieldset">
                <FormHelperText>
                    <div align="center">Enter Your Nickname and Room Code</div>
                </FormHelperText>
                <TextField margin="normal"
                    label="Nickname"
                    id="outlined-size-normal"
                    defaultValue="Anonymous"
                    variant="outlined"
                    required={true}
                    placeholder="Enter a nickname"
                />
                <TextField margin="normal"
                    label="Room code"
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    required={true}
                    placeholder="Enter a room code"
                    onChange={handleTextFieldChange}
                    error={error}
                    helperText={error}
                />
                </FormControl>
                </Grid>
                <Grid item xs={12} >
            <Button color="primary" variant="contained" onClick={handleJoinRoomButtonClick}>Join the Room</Button>
        </Grid>
        <Grid item xs={12} >
            <Button color="secondary" variant="contained" to="/player/" component={Link}>Back</Button>
        </Grid>


    </Grid>);
}