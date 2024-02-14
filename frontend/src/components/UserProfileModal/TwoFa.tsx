// import React, {useEffect, useState } from "react";
//
// // CSS
// import "src/styles/playerCardTable.css";
// import Button from "../shared/Button";
// import { authContentHeader } from "src/functions/utils";
// import  QRCode from 'react-qr-code';
// import  {useNavigate}  from 'react-router-dom';
//
// interface TwoFaProps {
//     twoFaProps: boolean;
// }
//
// function TwoFa() {
//     const [qrCodeUrl, setQrCodeUrl] = useState('');
//     const [securityCode, setSecurityCode] = useState('');
//     const [twoFa, set2fa] = useState(false);
//
//     const navigate = useNavigate();
//
//     const handle2FaButtonClick = () => {
//         const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/2fa";
//         fetch(apiUrl, {
//             method: "POST",
//             headers: authContentHeader(),
//         }).then(response => {
//             if (!response.ok)
//                 throw new Error("Failed to enable/disable 2Fa");
//             return response.json();})
//             .then(data=>{
//                 if (!twoFa) {
//                     const qrURL = data.url;
//                     if (!qrURL)
//                         throw new Error("Failed to get qrURL");
//                     setQrCodeUrl(qrURL);
//                 }
//             }).catch(error => {
//             console.log("Error in handle2FaButtonClick", error);
//
//         })
//     }
//
//
//     const handleSubmitCode = (event: React.FormEvent<HTMLFormElement>) => {
//         event.preventDefault();
//         twoFa ===false ? submitEnable() : submitDisable();
//     }
//
//     const submitEnable = () => {
//         const code = securityCode;
//         const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/verify2fa";
//         fetch(apiUrl, {
//             method: "POST",
//             headers: authContentHeader(),
//             body: JSON.stringify({code})
//         }).then(response => {
//             if (!response.ok)
//                 throw new Error("Failed to enable 2Fa");
//             return response.json();})
//             .then(data=>{
//                 if (data.success === true){
//                     setQrCodeUrl('');
//                 }
//             }).then(() => {
//             navigate(`/message/${"success"}/${"2FA is successfully enabled."}`);
//         }).catch(error => {
//             console.log("Error in handleSubmitCode", error);
//         })
//     }
//
//     const handleCodeChaneg = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setSecurityCode(event.target.value);
//     }
//
//     const submitDisable = () => {
//         console.log("submitDisable");
//     }
//
//
//     useEffect(() => {
//         fetch2FaStateFromDatabase();
//     }, [qrCodeUrl]);
//
//     const fetch2FaStateFromDatabase = () => {
//         fetch(process.env.REACT_APP_BACKEND_URL + "/auth/42/2fa/state",
//             {
//                 method: "GET",
//                 headers: authContentHeader()})
//             .then(response => response.json())
//             .then(data => {
//                 set2fa(data.twoFa);
//             })
//             .catch(error => {
//                 console.error('Error fetching 2FA state:', error);
//             });
//     };
//
//
//     return ( <>
//             {/*{!qrCodeUrl && <div>*/}
//             {!qrCodeUrl && <Button name={twoFa === true? "Disable" : "Enable"} onClick={() => {handle2FaButtonClick()}} />}
//             {qrCodeUrl && !twoFa && <form onSubmit={handleSubmitCode}>
//                     <p>Please enter security code.</p>
//                     <label htmlFor="securityCode"></label>
//                     {qrCodeUrl && <QRCode value={qrCodeUrl} size={150} />}
//                     <input type="text" id="securityCode" name="securityCode" style={{width:"80px", marginRight: "50px", marginLeft: "57px", marginTop: "50px"}} onChange={handleCodeChaneg} />
//                     <button className="btn-dark" type="submit" value={securityCode} style={{width: "80", marginTop: "10px", marginRight: "70px"}}>Submit</button>
//             </form>}
//    </> );
// }
//
//
//
//
// export default TwoFa;



import React, { useState } from 'react';
import axios from 'axios';

function TwoFa() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [securityCode, setSecurityCode] = useState('');

    const handleGetQrCode = async () => {
        try {
            const response = await fetch('http://localhost:5500/auth/42/2fa', {
                method: 'POST',
            });
            if (!response.ok) {
                throw new Error('Failed to enable/disable 2Fa');
            }
            const data = await response.json();
            const { qrCodeUrl } = data.url;
            setQrCodeUrl(qrCodeUrl);
        } catch (error) {
            console.error('Error fetching QR code:', error);
        }
    };


    const handleSubmitSecurityCode = async (e) => {
        e.preventDefault();
        try {
            // Send security code to backend for verification
            await axios.post('http://localhost:3001/2fa/verify', { securityCode });
            // Redirect user to home page or another route upon successful verification
            // You can handle this based on your application flow
        } catch (error) {
            console.error('Error verifying security code:', error);
        }
    };

    return (
        <div>
            <h1>Two-Factor Authentication</h1>
            <button onClick={handleGetQrCode}>Get QR Code</button>
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" />}
            <form onSubmit={handleSubmitSecurityCode}>
                <input
                    type="text"
                    placeholder="Enter Security Code"
                    value={securityCode}
                    onChange={(e) => setSecurityCode(e.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default TwoFa;
