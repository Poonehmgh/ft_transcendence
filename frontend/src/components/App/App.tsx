import React, { useEffect } from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "src/contexts/SocketProvider";
import { AuthProvider } from "src/contexts/AuthProvider";
import { UserDataProvider } from "src/contexts/UserDataProvider";

function App() {
    return (
        <AuthProvider>
            <UserDataProvider>
                <SocketProvider>
                    <BrowserRouter>
                        <PongersRoutes />
                    </BrowserRouter>
                </SocketProvider>
            </UserDataProvider>
        </AuthProvider>
    );
}

export default App;
