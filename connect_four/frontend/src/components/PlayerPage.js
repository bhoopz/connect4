import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Slider, makeStyles } from "@material-ui/core"

export default function PlayerPage(props){
    return (<Grid container spacing={1} align="center">
    
<Grid item xs={12}>
    <Button color="primary" variant="contained" to="/player/create" component={Link} >CREATE ROOM</Button>
</Grid>
<Grid item xs={12}>
    <Button color="secondary" variant="contained" to="/player/join" component={Link}>JOIN ROOM</Button>
</Grid>
<Grid item xs={12}>
    <Button color="primary" variant="contained" to="/player/room" component={Link}>FIND PLAYER</Button>
</Grid>
<Grid item xs={12}>
    <Button color="secondary" variant="contained" to="/" component={Link}>BACK</Button>
</Grid>
</Grid>)
}