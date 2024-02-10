// SocketContextProvider.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import SocketContext from "./SocketContext";
import backendUrl from "src/constants/backendUrl";

function SocketContextProvider(props) {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Code to initialize socket connection
        const newSocket = io(backendUrl.base);
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {props.children}
        </SocketContext.Provider>
    );
}

export default SocketContextProvider;
