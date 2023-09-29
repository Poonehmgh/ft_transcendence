import React from "react";
import ReactDOM from "react-dom/client"; // what's up with this?
//import ReactDOM from "react-dom";

import Router from "./components/Router";
import Modal from "react-modal";
import "./styles/style.css";


ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
    <Router />
  </React.StrictMode>
);
