import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./components/Router.tsx";
import './styles/style.css';

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
);
