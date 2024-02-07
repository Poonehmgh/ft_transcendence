import React, { createContext, useEffect, useState } from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { io } from "socket.io-client";
import backendUrl from "src/constants/backendUrl";

const SocketContext = createContext(null);

function App() {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        function createSocket() {
        const newSocket = io(backendUrl.base, {
            query: { userID: 98525 },
        });
        setSocket(newSocket);
    }
        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            <BrowserRouter>
                <PongersRoutes />
            </BrowserRouter>
        </SocketContext.Provider>
    );
}

export default App;
