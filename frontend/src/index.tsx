import React from "react";
import ReactDOM from "react-dom/client";
import Modal from "react-modal";
import App from "src/components/app";


const root = document.getElementById("root");
Modal.setAppElement("#root");

if (root) {
    const appRoot = ReactDOM.createRoot(root);
    appRoot.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
}
