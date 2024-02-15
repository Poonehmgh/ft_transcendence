import React from "react";
import MessageInput from "./MessageInput";
import MessageDisplay from "./MessageDisplay";

// CSS
import "src/styles/chat.css";
import "src/styles/style.css";

function MiddleBar(): React.JSX.Element {
    return (
        <div className="middleBar">
            <MessageDisplay />
            <MessageInput />
        </div>
    );
}

export default MiddleBar;
