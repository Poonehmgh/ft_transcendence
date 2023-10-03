import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const socket = io('http://172.20.10.3:5500');



const ConfirmQueue = () => {
    const [receivedMessage, setReceivedMessage] = useState('');

    useEffect(() => {
      // Listen for custom events from the server
      socket.on('queueConfirm', (data) => {
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
        socket.off('server-message');
      };
    }, []);
  
    const sendMessageToServer = () => {
      socket.emit('joinQueue', {'userID': 2});
    };
  
    return (
      <div>
        {/* <button onClick={sendMessageToServer}>Send Message</button> */}
        <div>
          <strong>{receivedMessage}</strong>
        </div>
      </div>
    );
}

export default ConfirmQueue;