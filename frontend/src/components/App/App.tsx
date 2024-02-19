import React from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "src/contexts/SocketProvider";
import { AuthProvider } from "src/contexts/AuthProvider";
import { SocialDataProvider } from "src/contexts/SocialDataProvider";

function App() {
    return (
        <AuthProvider>
            <SocialDataProvider>
                <SocketProvider>
                    <BrowserRouter>
                        <PongersRoutes />
                    </BrowserRouter>
                </SocketProvider>
            </SocialDataProvider>
        </AuthProvider>
    );
}

export default App;
