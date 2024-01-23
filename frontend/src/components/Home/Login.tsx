import React from "react";

// CSS
import "src/styles/style.css";
import "src/styles/login.css";

function Login() {
    return (
        <div className="mainContainerRow">
            <div className="loginContainer">
                <button
                    className="bigButton"
                    style={{ fontSize: "3rem", padding:"20px"}}
                    onClick={AuthComponent}
                >
                    🔑
                </button>
            </div>
        </div>
    );
}

const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";
function AuthComponent() {
    try {
        window.location.assign(apiUrl);
    } catch (e) {
        alert(e);
    }
    // fetch(apiUrl, {
    //     method: "GET",
    //     // credentials: "include",
    //     // body: JSON.stringify(postData),
    // }).then((response) => {
    //     if (!response.ok) {
    //         throw new Error('Network response was not ok');
    //     }
    //     window.location.href = response.url
    //     console.log("response ok", response);
    //     return response;
    // }).then((data) => {
    //     console.log(data);
    // }).catch((error) => {
    //     console.error('There was a problem with the fetch operation:', error);
    // });
}

export default Login;
