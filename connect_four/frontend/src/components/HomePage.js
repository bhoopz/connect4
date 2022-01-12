import React, {useState, useEffect} from "react";
import { render } from "react-dom";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage"
import Room from "./Room"
import PlayerPage from "./PlayerPage"
import ComputerPage from "./ComputerPage"
import GamePage from "./GamePage"
import { BrowserRouter as Router, Switch, Route, Link, Redirect, useHistory } from "react-router-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText, makeStyles} from "@material-ui/core"


const useStyles = makeStyles({
    flexGrow: {
        flex: '1',
      },
    button: {
      width: '100%',
      backgroundColor: 'rgb(255, 190, 166)',
      borderRadius: '10px',
      fontSize: "min(max(10px, 2vw), 16px)",
      '&:hover': {
        backgroundColor: 'rgb(252, 192, 96)',
    },
  }})

export default function HomePage(props) {

    let history = useHistory();
    const [data, setData] = useState([]);
    const classes = useStyles()

    async function fetchMyAPI() {
        let response = await fetch('/player/room')
        response = await response.json()
        setData(response)
      }

    useEffect(() => {
        fetchMyAPI()
      }, [])

    //   useEffect(() => {
    //     const interval = setInterval(() => {
    //       fetchMyAPI()
    //     }, 1000);
    //     return () => clearInterval(interval);
    //   }, []);

      

      

      const handleJoinRoomButtonClick= (roomCode) => {
        
        const nick = "Anonymous"
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
            }
        })
    }


    const generateHomePage = () => {
        return (<Grid container spacing={2} align="center">
            <Grid item xs={12}>
            <Typography component="h3" variant="h3">
                Connect 4
            </Typography>
            

            <div className="live-rooms">
            {data.map(function(item, i){
            return (item.public==true && item.player_id==null ?
                
            <Grid item xs={12} key={i}> 
                <Button className={classes.button}  variant="contained" disabled={item.player_id!=null} onClick={() => handleJoinRoomButtonClick(item.code)} key={i}>{item.host_nickname} - {item.game_time=="00:00:00" ? "None" : item.game_time.split('00:')[1]}</Button>
            </Grid>
            
            : null)
})}
</div>
            
        </Grid>      
        <Grid item xs={12}>
        <Button color="primary" variant="contained" to="/player/" component={Link} >PLAYER</Button>
        </Grid>
        <Grid item xs={12}>
        <Button color="secondary" variant="contained" to="/computer/" component={Link}>COMPUTER</Button>
        </Grid>
        </Grid>)
    }


    return (
        <Switch>
            <Route exact path="/">
                {generateHomePage}
            </Route>
            <Route path="/player/join" component={RoomJoinPage}>
            </Route>
            <Route path="/player/create" component={RoomCreatePage}>
            </Route>
            <Route path="/player/room/:roomCode" component={Room}>
            </Route>
            <Route path="/player" component={PlayerPage}>
            </Route>
            <Route exact path="/computer" component={ComputerPage}>
            </Route>
            <Route path="/computer/easy" component={GamePage}>
            </Route>
            <Route path="/computer/medium" component={GamePage}>
            </Route>
            <Route path="/computer/hard" component={GamePage}>
            </Route>
        </Switch>
      );
}

