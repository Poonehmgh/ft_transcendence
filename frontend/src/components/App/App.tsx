import React from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { SocketProvider } from "src/contexts/SocketProvider";
import { AuthProvider } from "src/contexts/AuthProvider";
import { SocialDataProvider } from "src/contexts/SocialDataProvider";
import { ToastProvider } from "src/contexts/ToastProvider";

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <ToastProvider>
                    <SocialDataProvider>
                        <SocketProvider>
                            <PongersRoutes />
                        </SocketProvider>
                    </SocialDataProvider>
                </ToastProvider>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
