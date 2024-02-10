import React, { useEffect } from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { SocketContext, socket } from "src/contexts/socketContext";

function App() {
    useEffect(() => {
        return () => {
            socket.disconnect();
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
