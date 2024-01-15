import React from "react";
import ReactDOM from "react-dom/client";

import Router from "./components/Router";
import "./styles/style.css";
import Modal from "react-modal";

Modal.setAppElement("#root");



ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
    <Router />
  </React.StrictMode>
);
