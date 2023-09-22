import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./components/Router.tsx";
import './styles/style.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';


ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
);
