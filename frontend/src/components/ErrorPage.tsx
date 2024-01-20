import React from "react";

// CSS
import "src/styles/bigTable.css";

function ErrorPage() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                marginTop: "100px",
            }}
        >
            <p>Requested resource does not exist. Have a cat pic instead.</p>
            <img
                src="/images/handsome_boi.jpg"
                alt="handsome_boi"
                style={{ height: "auto", width: "400px" }}
            />
        </div>
    );
}

export default ErrorPage;
