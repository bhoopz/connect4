import React, { UseState } from "react";
import { render } from "react-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"
import { Link } from "react-router-dom";


export default function ComputerPage(props){
    const [level, setLevel] = React.useState(1);
    const [value, setValue] = React.useState("");
    const handleButtonClick = (value, level) => {
        setValue(value)
        setLevel(level)
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                bot_level: level,         
            })
        };
        fetch("/computer/create-game", requestOptions).then((response) => response.json()).then((data) => props.history.push("/computer/" + value));
    }

    return (
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <Typography component="h4" variant="h4">
                    Computer level
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <Button color="primary" variant="contained" value='easy' onClick={(e) => handleButtonClick(e.currentTarget.value, 1)}>Easy</Button>
                <Button color="primary" variant="contained" value='medium' onClick={(e) => handleButtonClick(e.currentTarget.value, 3)}>Medium</Button>
                <Button color="primary" variant="contained" value='hard' onClick={(e) => handleButtonClick(e.currentTarget.value, 5)}>Hard</Button>
            </Grid>
        </Grid>)
}