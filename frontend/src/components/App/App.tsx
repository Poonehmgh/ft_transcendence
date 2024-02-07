import React from "react";
import PongersRoutes from "./Routes";
import { BrowserRouter } from "react-router-dom";

function App() {
    return (
        <BrowserRouter>
            <PongersRoutes />
        </BrowserRouter>
    );
}

export default App;
