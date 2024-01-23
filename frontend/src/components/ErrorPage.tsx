import React from "react";

function ErrorPage() {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: "7vh",
                textAlign: "center",
            }}
        >
            <p>
                Requested resource does not exist.
                <br />
                <br />
                Have a cat pic instead:
            </p>
            <img
                src="/images/tekir.jpg"
                alt="best_boi"
                style={{ height: "auto", width: "400px" }}
            />
        </div>
    );
}

export default ErrorPage;
