import React from "react";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText, makeStyles} from "@material-ui/core"
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

export default function RoomJoinPage(props) {

    const useStyles = makeStyles({
        root: {
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }})

    const classes = useStyles()

    let history = useHistory();
    const [roomCode, setRoomCode] = React.useState("");
    const [error, setError] = React.useState("");
    const [nick, setNick] = React.useState("Anonymous")
    const handleTextFieldChange = (e) => {
        setRoomCode(e.target.value)
    }
    const handleTextFieldChange2 = (e) => {
        setNick(e.target.value)
    }

    const handleJoinRoomButtonClick= () => {
        
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                code: roomCode,
                player_nickname: nick,
            })
        };
        fetch("/player/join-room", requestOptions).then((response) => {
            if(response.ok){
                history.push({pathname:`/player/room/${roomCode}`, state:{nick}})
            }else{
                setError("Room not found :(")
            }
        })
    }

    
    return (
    <Grid className={classes.root} container spacing={1} align="center">
        <Grid item xs={12}>
            <Typography component="h4" variant="h4">
                Join the Room
            </Typography>
        </Grid>
        <Grid item xs={12} >
            <FormControl component="fieldset">
                <FormHelperText>
                    Enter Your Nickname and Room Code
                </FormHelperText>
                <TextField margin="normal"
                    label="Nickname"
                    id="outlined-size-normal"
                    defaultValue="Anonymous"
                    variant="outlined"
                    required={true}
                    placeholder="Enter a nickname"
                    onChange={handleTextFieldChange2}
                />
                <TextField margin="normal"
                    label="Room code"
                    id="outlined-size-normal"
                    defaultValue=""
                    variant="outlined"
                    required={true}
                    placeholder="Enter a room code"
                    onChange={handleTextFieldChange}
                    error={error.length > 0}
                    helperText={error}
                />
                </FormControl>
                </Grid>
                <Grid item xs={12} >
            <Button style={{width: 150, borderRadius: 15}} color="primary" variant="contained" onClick={handleJoinRoomButtonClick}>Join the Room</Button>
        </Grid>
        <Grid item xs={12} >
            <Button style={{width: 150}} color="secondary" variant="contained" to="/player/" component={Link}>Back</Button>
        </Grid>

        
    </Grid>);
    
}