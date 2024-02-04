import React from "react";
import '../../styles/game.css';
import { io } from 'socket.io-client';
import { useEffect, useState } from "react";
// import { JoinGameDTO } from '/backend/src/game/game.DTOs.ts';


const socket = io('localhost:5500');

const PlayButton = () => {
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
      // Listen for custom events from the server
      socket.on('queueConfirm', (data: string) => {
        if (data === 'Confirmed') {
          // Handle confirmation of entering the queue
          setReceivedMessage('Queue confirmed')
        } else if (data === 'InvalidID') {
          // Handle invalid ID confirmation
          setReceivedMessage('Invalid ID');
        }
      });
  
      return () => {
        // Clean up event listeners when the component unmounts
        socket.off('queueConfirm');
      };
    }, []);
  
    const sendMessageToServer = () => {
      socket.emit('joinQueue', {'userID': 2});
    };


  return (
    <div>
      <button className="playbutton" onClick={sendMessageToServer}>Join Queue</button>
      <p className="queueconfirm">{receivedMessage}</p>
    </div>
  );
};

export default PlayButton;