import React from "react";

// CSS
import "src/styles/style.css";

interface Loading_h2Props {
    elementName: string;
}

function Loading_h2(props: Loading_h2Props) {
    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">{props.elementName}</div>
                <p>Loading data...</p>
            </div>
        </div>
    );
}

export default Loading_h2;
