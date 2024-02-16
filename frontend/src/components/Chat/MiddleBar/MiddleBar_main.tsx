import React from "react";
import MessageInput from "./MessageInput";
import MessageDisplay from "./MessageDisplay";

function MiddleBar(): React.JSX.Element {
    return (
        <div className="middleBar">
            <MessageDisplay />
            <MessageInput />
        </div>
    );
}

export default MiddleBar;
