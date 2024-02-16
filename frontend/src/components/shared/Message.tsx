import React from 'react';
// import './MessageComponent.css'; // Import CSS file
import { useParams } from 'react-router-dom';

function Message() {
    let className = 'message'
    const { type, msg } = useParams();
    const message = "Oops! Something happened."

    return (
        
        <div className={className}
             style={{
                 display: "flex",
                 flexDirection: "column",
                 alignItems: "center",
                 paddingTop: "7vh",
                 textAlign: "center",
             }}>
            <p>
                {msg ? msg : message}
                <br />
                <br />
                {type === "success" && "Also there is a cat pic for you:"}
                {type === "error" && "Have a cat pic instead:"}
            </p>
            <img
                src="/images/tekir.jpg"
                alt="best_boi"
                style={{ height: "auto", width: "400px" }}
            />
        </div>
    );
}

export default Message;
