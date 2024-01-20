import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import Router from "./components/Router";
import Modal from "react-modal";
import Header from "./components/Header/Header_main";

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <Router />
    </React.StrictMode>
);
