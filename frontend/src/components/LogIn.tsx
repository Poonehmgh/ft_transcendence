import React from "react";
import Header from "./Header";
import '../styles/log-in.css'

function LogIn() {
    return (
        <div className="sections-container">
            <Header />
            <div className="section left-bar">Left Bar</div>
            <div className="section center">
                {/*<AuthComponent />*/}
              <div>
                <button onClick={handleLoginClick}>Authenticate</button>
              </div>
            </div>
            <div className="section right-bar">Right Bar</div>
            <div className="section footer">Footer</div>
        </div>
    );
}

// function AuthComponent() {
//   const handleAuthentication = async () => {
//     try {
//       // Make a GET request to your NestJS authentication endpoint
//       const response = await fetch('http://localhost:5500/auth/42/login', {
//         method: 'GET',
//         credentials: 'include', // Send cookies with the request
//       });
//
//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//
//       // Parse the response data as JSON
//       const data = await response.json();
//
//       // Handle the response data as needed
//       console.log(data);
//     } catch (error) {
//       // Handle errors here
//       console.error('Authentication failed:', error);
//     }
//   };
//
//   return (
//       <div>
//         <button onClick={handleAuthentication}>Authenticate</button>
//       </div>
//   );
// }

import axios from 'axios'; // Assuming you have Axios installed

function AuthComponent() {
  const handleAuthentication = async () => {
    try {
      // Make a GET request to your NestJS authentication endpoint
      const response = await axios.get('http://localhost:5500/auth/42/login', { withCredentials: true });
      
      // Handle the response from the server
      console.log(response.data); // Handle the response data as needed
    } catch (error) {
      // Handle errors here
      console.error('Authentication failed:', error);
    }
  };
  
  return (
      <div>
        <button onClick={handleAuthentication}>Authenticate</button>
      </div>
  );
}

const ipAddress = "localhost:3000";

const handleLoginClick = async() => {
  try {
    window.location.assign(`https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-ebe5af0f2962dca5114adf05b60c69a7cbbb6ec31e4cd146812b74d954feb284&redirect_uri=http%3A%2F%2F${ipAddress}%3A3003%2Fauth%2Flogin&response_type=code`);
  }
  catch (error) {
    alert('An error occurred during login');
  }
}

export default LogIn;