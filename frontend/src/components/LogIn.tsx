import React from "react";
import Header from "./Header/Header_main";
import '../styles/log-in.css'

function LogIn() {
    return (
        <div className="sections-container">
            <Header />
            <div className="section left-bar">Left Bar</div>
            <div className="section center">
                {/*<AuthComponent />*/}
                <div>
                    <button onClick={AuthComponent}>Authenticate</button>
                </div>
            </div>
            <div className="section right-bar">Right Bar</div>
            <div className="section footer">Footer</div>
        </div>
    );
}

const apiUrl = "http://localhost:5500/auth/42/login";
function AuthComponent() {
    try{
        window.location.assign(apiUrl);
    }
    catch (e) {
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


export default LogIn;