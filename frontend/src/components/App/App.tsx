import React, { useEffect } from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "src/contexts/SocketProvider";
import { AuthProvider } from "src/contexts/AuthProvider";

function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <BrowserRouter>
                    <PongersRoutes />
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    );
}

export default App;
