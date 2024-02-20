/*React*/
import React, {useEffect, useState } from "react";
import {useCookies} from "react-cookie";

/*CSS*/
import "src/styles/style.css";
import "src/styles/home.css";
import "src/styles/buttons.css";

/*Components*/
import Login from "./Login";



const Auth = () => {
    const [code, setCode] = useState('');

    const [cookies] = useCookies(['user']);
    const userEmail = cookies.user.email;
    const userTwofa = cookies.user.twoFa;
    const userName = cookies.user.name;


    const handleSubmit = async (e) => {
        e.preventDefault();

            const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/twofa/authenticate2fa";
            fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({code: code, email: userEmail})
                }).then(response => {
                    if (!response.ok)
                        throw new Error();
                    return response.json();
                    }
                    ).then(data=>{
                        const token = data.token;
                        document.cookie = `token=${token}`;
                        // window.location.href = process.env.REACT_APP_FRONTEND_URL + "/home";
                        window.location.href = "http://localhost:3000/home";
                    }
                        ).catch((error) =>{
                            console.error('Error authenticating:', error);
        })
    };

    // localhost change

    return (<>
        <div className="mainContainerRow">
            <div>
                <div className="h2">Home</div>
                {userEmail ? (
                    !userTwofa ?(
                            <div className="h2">{`Welcome, ${userName}!`}</div>)
                        :(
                            <div className="h2">{`Hello, ${userName}! Please enter security code.`}</div>
                        )) : (
                    <Login />
                )}
            </div>
        </div>
        {userEmail && <div>
            <h2>Two-Factor Authentication</h2>
            <p>Please enter the authentication code:</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Authentication Code:
                    <input
                        type="text"
                        value={code}
                        style={{width:"80px", marginRight: "10px", marginLeft: "20px", marginTop: "0px"}}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </label>
                <button className="btn btn-dark" type="submit" style={{marginLeft: "10px"}}>Submit</button>
            </form>
        </div>}

    </>);
};

export default Auth;
