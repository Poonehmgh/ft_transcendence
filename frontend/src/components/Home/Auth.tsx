import React, {useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
// DTO
import { UserProfileDTO } from "user-dto";
// CSS
import "src/styles/style.css";
import "src/styles/home.css";
import "src/styles/buttons.css";
import Login from "./Login";



// function Auth() {
//     const loginRedirUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/login";
//
//
//     const [userData, setUserData] = useState<UserProfileDTO>(null);
//     const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";
//
//     useEffect(() => {
//         fetchGetSet(apiUrl, setUserData);
//     });
//
//     {console.log("user data?" , userData)}
//
//     return (
//         <div className="mainContainerRow">
//             <div>
//                 <div className="h2">Home</div>
//                 {userData ? (
//                     !userData.twoFa ?(
//                         <div className="h2">{`Welcome, ${userData.name}!`}</div>)
//                 :(
//                         <div className="h2">{`Hello, ${userData.name}! Please enter security code.`}</div>
//                 )) : (
//                     <Login />
//                 )}
//             </div>
//         </div>
//     );
// }
//
// export default Auth;



import {useCookies} from "react-cookie";

const Auth = () => {
    const [code, setCode] = useState('');

    // Get user email from cookies
    const [cookies] = useCookies(['user']);
    const userEmail = cookies.user.email;
    const userTwofa = cookies.user.twoFa;
    const userName = cookies.user.name;

    // const [userData, setUserData] = useState<UserProfileDTO>(null);
    // const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";
    //
    // useEffect(() => {
    //     fetchGetSet(apiUrl, setUserData);
    // });


    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a POST request to authenticate with the two-factor authentication code
            const response = await fetch('http://localhost:5500/auth/twofa/authenticate2fa', {
                method: 'POST',
                body: JSON.stringify({
                email: userEmail,
                code: code})
            });

            // Handle response if needed
            console.log('Authentication successful:', response);
        } catch (error) {
            // Handle error if the authentication fails
            console.error('Error authenticating:', error);
        }
    };

    // console.log("user data?" , userData);
    return (<>
    {userEmail && <div>
            <h2>Two-Factor Authentication</h2>
            <p>Please enter the authentication code:</p>
            <form onSubmit={handleSubmit}>
                <label>
                    Authentication Code:
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>}
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
    </>);
};

export default Auth;
