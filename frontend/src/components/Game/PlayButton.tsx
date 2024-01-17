import React from "react";
import '../../styles/game.css';
import { io } from 'socket.io-client';

export const socket = io('http://172.20.10.3:5500');

function confirm() {
    socket.emit('joinQueue', {'userID': 2});
    // console.log("Clicked");
}

const PlayButton = () => {
    return(
        <div>
            <button onClick = {confirm} className ="playbutton">
                Play
            </button>
        </div>
    );
}

export default PlayButton;