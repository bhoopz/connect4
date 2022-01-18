import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid,  makeStyles } from "@material-ui/core"

export default function PlayerPage(props){

    const useStyles = makeStyles({
        root: {
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }})

    const classes = useStyles()

    return (<Grid className={classes.root} container spacing={2} align="center">
    
<Grid item xs={12}>
    <Button style={{width: 150, borderRadius: 15}} color="primary" variant="contained" to="/player/create" component={Link} >CREATE ROOM</Button>
</Grid>
<Grid item xs={12}>
    <Button style={{width: 150, borderRadius: 15}} color="primary" variant="contained" to="/player/join" component={Link}>JOIN ROOM</Button>
</Grid>
<Grid item xs={12}>
    <Button style={{width: 150}} color="secondary" variant="contained" to="/" component={Link}>BACK</Button>
</Grid>
</Grid>)
}