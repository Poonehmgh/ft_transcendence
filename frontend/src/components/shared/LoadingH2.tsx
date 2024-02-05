import React from "react";

// CSS
import "src/styles/style.css";

interface LoadingH2Props {
    elementName: string;
}

function LoadingH2(props: LoadingH2Props) {
    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">{props.elementName}</div>
                <p>Loading data...</p>
            </div>
        </div>
    );
}

export default LoadingH2;
