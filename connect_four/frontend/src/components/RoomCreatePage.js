import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Button, Grid, Typography, TextField, FormHelperText, FormControl, Radio, RadioGroup, FormControlLabel, Slider, makeStyles } from "@material-ui/core"
import Select from 'react-select'

export default function RoomCreatePage(props) {
    let [value, setValue] = React.useState(5);
    const [nick, setNick] = React.useState("Anonymous")
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleTextFieldChange2 = (e) => {
        setNick(e.target.value)
    }

    const [buttonValue, setButtonValue] = React.useState("without");
    const handleButtonChange = (event) => {
        
        setButtonValue(event.target.value);
    }

    const useStyles = makeStyles({
        root: {
          width: 200,
          marginTop:10,
        },
      });
    const classes = useStyles();
    

    const handleButtonClick = () => {
        
        if(buttonValue == "without"){
            value = '00'
        }
        const requestOptions= {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ 
                game_time: '00:' + value + ':00',
            })
        };
        fetch("/player/create-room", requestOptions).then((response) => response.json()).then((data) => props.history.push({pathname:"/player/room/" + data.code, state:{nick}}));
    }

    

    const generateSlider = () => {
        
        return (<div className={classes.root}>
            <Typography id="continuous-slider" gutterBottom>
                Minutes per Player: <b>{value}</b>
            </Typography>
            <Slider 
                value={value} 
                onChange={handleChange} 
                min={1}
                max={30}/>
        </div>)
    }

    

    return (<Grid container spacing={1} align="center">
        <Grid item xs={12}>
            <Typography component="h4" variant="h4">
                Create a Room
            </Typography>
        </Grid>
        <Grid item xs={12} >
            <FormControl component="fieldset">
                <FormHelperText>
                    Enter Your Nickname
                </FormHelperText>
                <TextField margin="normal"
                    label="Nickname"
                    id="outlined-size-normal"
                    defaultValue="Anonymous"
                    variant="outlined"
                    required={true}
                    onChange={handleTextFieldChange2}
                />
                <RadioGroup row value={buttonValue} onChange={handleButtonChange}>
                <FormControlLabel value={"with"}
                    control={<Radio color="primary" />}
                    label = "With time"
                    labelPlacement = "bottom" />
                <FormControlLabel value={"without"}
                    control={<Radio color="secondary" />}
                    label = "Without time"
                    labelPlacement = "bottom" />       
            </RadioGroup>
            {buttonValue==="with" ? generateSlider() : null}
            
            </FormControl>
                              
        </Grid>
        <Grid item xs={12} >
            <Button color="primary" variant="contained" onClick={handleButtonClick}>Create a Room</Button>
        </Grid>
        <Grid item xs={12} >
            <Button color="secondary" variant="contained" to="/player" component={Link}>Back</Button>
        </Grid>
        
        
    </Grid>);
}


