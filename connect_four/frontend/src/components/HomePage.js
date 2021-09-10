import React, {useState, useEffect} from "react";
import { render } from "react-dom";
import RoomJoinPage from "./RoomJoinPage";
import RoomCreatePage from "./RoomCreatePage"
import Room from "./Room"
import PlayerPage from "./PlayerPage"
import ComputerPage from "./ComputerPage"
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import axios from 'axios';

export default function HomePage(props) {

    const [data, setData] = useState([]);

    useEffect(() => {
        async function fetchMyAPI() {
          let response = await fetch('player/room')
          response = await response.json()
          setData(response)
        }
    
        fetchMyAPI()
      }, [])
    
    
    
    

    const generateHomePage = () => {
        return (<Grid container spacing={1} align="center">
            <Grid item xs={12}>
            <Typography component="h3" variant="h3">
                Connect 4
            </Typography>
            {<div>{JSON.stringify(data.map((room) => {return room}))}</div>}
            
        </Grid>      
        <Grid item xs={12}>
        <Button color="primary" variant="contained" to="/player/" component={Link} >PLAYER</Button>
        </Grid>
        <Grid item xs={12}>
        <Button color="secondary" variant="contained" to="/computer/" component={Link}>COMPUTER</Button>
        </Grid>
        </Grid>)
    }


    return (<Router>
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
            <Route path="/computer" component={ComputerPage}>
            </Route>
        </Switch>
        </Router>);
}

