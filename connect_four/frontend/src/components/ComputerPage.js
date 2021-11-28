import React, { UseState } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { Link } from "react-router-dom";


export default function ComputerPage(props){
    const [level, setLevel] = React.useState(1);
    const [value, setValue] = React.useState("");
    

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    Computer level
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button color="primary" variant="contained" value='easy' to="/computer/easy" component={Link}>Easy</Button>
                <Button color="primary" variant="contained" value='medium' to="/computer/medium" component={Link}>Medium</Button>
                <Button color="primary" variant="contained" value='hard' to="/computer/hard" component={Link}>Hard</Button>
            </Grid>
        </Grid>)
}