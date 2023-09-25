import React from "react";
import Header from "./Header";
import axios from 'axios';
import Cookies from 'js-cookie'
import '../styles/log-in.css'

function LogIn() {
    return (
        <div className="sections-container">
            <Header />
            <div className="section left-bar">Left Bar</div>
            <div className="section center">
                {/*<AuthComponent />*/}
              <div>
                <button onClick={fetchData}>Authenticate</button>
              </div>
            </div>
            <div className="section right-bar">Right Bar</div>
            <div className="section footer">Footer</div>
        </div>
    );
}


const fetchData = async () => {
  try {
    const response = await axios.get('http://localhost:5500/auth/42/redirect');
    const token = response.data.token;
    
    // Store the token in cookies
    // Cookies.set('token', token);
    console.log(token);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default LogIn;