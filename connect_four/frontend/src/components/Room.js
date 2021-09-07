import React, {useState} from "react";
import { render } from "react-dom";
import { useParams } from "react-router-dom";



export default function Room(props) {
    let params = useParams();
    const [gameTime, setGameTime] = useState('00:00:00');
    const [isHost, setIsHost] = useState(false);
    
    
    const getRoomDetails = () => {
        fetch('/player/get-room' + '?code=' + params.roomCode)
        .then((response) => response.json())
        .then((data) => {
            setGameTime(data.game_time),
            setIsHost(data.is_host)
        });
    }

    getRoomDetails()

    return (<div>
        <h3>{params.roomCode}</h3>
        <p>{gameTime}</p>
        <p>{isHost.toString()}</p>
        </div>);
}

