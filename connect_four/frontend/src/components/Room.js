import React, {useState} from "react";
import { useEffect } from "react";
import { render } from "react-dom";
import { useParams, useHistory, Redirect } from "react-router-dom";
import {Grid, TextField, Typography, Button, FormControl, FormHelperText} from "@material-ui/core"



export default function Room(props) {
    let params = useParams();
    let history = useHistory();
    const [gameTime, setGameTime] = useState('00:00:00');
    const [isHost, setIsHost] = useState(false);
    if(!history.location.state || !history.location.state.nick){
        return <Redirect to ="/player/join/" />
    }
    const getRoomDetails = () => {
        fetch('/player/get-room' + '?code=' + params.roomCode)
        .then((response) => response.json())
        .then((data) => {
            setGameTime(data.game_time),
            setIsHost(data.is_host)
        });
    }

    getRoomDetails()


    const roomCode = params.roomCode
    const nick = history.location.state.nick

      const chatSocket = new WebSocket(
        "ws://" + window.location.host + "/ws/player/room/" + roomCode + "/"
      );

      chatSocket.onclose = function (e) {
        console.error("Chat socket closed");
      };

      
      const sendMsg = function(){ 
        document.querySelector("#chat-message-submit").onclick = function (e) {
            const messageInputDom = document.querySelector("#chat-message-input");
            const message = messageInputDom.value;
            if(message != ""){
                chatSocket.send(
              JSON.stringify({
                message: message,
                nick: nick,
              })
            );
            messageInputDom.value = "";
          };}
    };
      

    useEffect(() => {
        chatSocket.onmessage = function (e) {
            const data = JSON.parse(e.data);
            document.querySelector("#chat-log").value += data.nick + ": " + data.message + "\n";
          };
          sendMsg()
      }, [])


    return (<div>
        <h3>{params.roomCode}</h3>
        <p>{gameTime}</p>
        <p>{isHost.toString()}</p>
        <p>{nick}</p>
        
        <Grid container spacing={1} align="center">
            <Grid item xs={12}>
                <textarea readOnly="readOnly" id="chat-log" cols="30" rows="20"></textarea><br />
                <input id="chat-message-input" type="text" size="31" /><br />
                <input id="chat-message-submit" type="button" value="Send" />
            </Grid>
            
        </Grid>
        
        </div>);
}

