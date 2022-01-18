import React, { UseState } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, makeStyles} from "@material-ui/core"
import { Link } from "react-router-dom";


export default function ComputerPage(props){
    
    const useStyles = makeStyles({
        root: {
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        },
        btn: {
            width: 150,
            backgroundColor: 'black',
            borderRadius: 15,
            '&:hover': {
                backgroundColor: 'rgb(255,0,0)',
            },
        },
        
    })

    const classes = useStyles()

    return (
        <Grid className={classes.root} container spacing={2} align="center">
            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    Computer level
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button className={classes.btn} color="primary" variant="contained" value='easy' to="/computer/easy" component={Link}>⚡</Button>
            </Grid>
            <Grid item xs={12}>
                <Button className={classes.btn} color="primary" variant="contained" value='medium' to="/computer/medium" component={Link}>⚡⚡⚡</Button>
                
            </Grid>
            <Grid item xs={12}>
                <Button className={classes.btn} color="primary" variant="contained" value='hard' to="/computer/hard" component={Link}>⚡⚡⚡⚡⚡</Button>
                
            </Grid>
            <Grid item xs={12}>
                <Button style={{width: 150}} color="secondary" variant="contained" to="/" component={Link}>BACK</Button>
            </Grid>
        </Grid>)
}