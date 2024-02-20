/*React*/
import React, {useEffect, useState } from "react";
import  {useNavigate}  from 'react-router-dom';
import { decodeToken } from "react-jwt";
import  QRCode from 'react-qr-code';

/*CSS*/
import "src/styles/playerCardTable.css";

/*Components*/
import Button from "../shared/Button";

/*Header*/
import { authContentHeader } from "src/functions/utils";




function TwoFa() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [securityCode, setSecurityCode] = useState('');
    const [twoFa, set2fa] = useState(false);
    const [disableClicked, setDisableClicked] = useState(false);

    const navigate = useNavigate();

    const handle2FaButtonClick = () => {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/twofa/generate";
        fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
        }).then(response => {
            if (!response.ok)
                throw new Error("Failed to enable/disable 2Fa");
            return response.json();})
            .then(data=>{
                // const token = data.token;
                // const decoded = decodeToken(token);
                if (!twoFa){
                    const qrURL = data.url;
                    if (!qrURL)
                        throw new Error("Failed to get qrURL");
                    setQrCodeUrl(qrURL);}
                else{
                    setQrCodeUrl('');
                    setDisableClicked(true);
                    }
            }).catch(error => {
            console.log("Error in handle2FaButtonClick", error);
        })
    }


    const handleSubmitCode = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        !twoFa ? submitEnable() : submitDisable();
    }

    const submitEnable = () => {
        const code = securityCode;
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/twofa/activate";
        fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
            body: JSON.stringify({code})
            }).then(response => {
                if (!response.ok)
                    throw new Error("Failed to enable 2Fa");
                return response.json();})
                .then(data=>{
                    if (data.success === true){
                        setQrCodeUrl('');
                    }
                    }).then(() => {
                        navigate(`/message/${"success"}/${"2FA is successfully enabled."}`);
                        }).catch(error => {
                            console.log("Error in handleSubmitCode", error);
                            navigate(`/message/${"success"}/${error}`);
        })
    }

    const handleCodeChaneg = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSecurityCode(event.target.value);
    }

    const submitDisable = () => {
        console.log("submitDisable", securityCode);
        const code = securityCode;
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/twofa/deactivate";
        fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
            body: JSON.stringify({code})
        }).then(response => {
            if (!response.ok)
                throw new Error("Failed to disable 2Fa");
            return response.json();})
            .then(data=>{
                if (data.success === true){
                    setQrCodeUrl('');
                    setDisableClicked(false);
                }
            }).then(() => {
            navigate(`/message/${"success"}/${"2FA is successfully disabled."}`);
        }).catch(error => {
            // navigate(`/message/${"success"}/Error: ${error}`);
            console.log("Error in handleSubmitCode", error);
        })

    }


    useEffect(() => {
        fetch2FaStateFromDatabase();
    }, [disableClicked]);

    const fetch2FaStateFromDatabase = () => {
        fetch(process.env.REACT_APP_BACKEND_URL + "/auth/twofa/state",
            {
                method: "GET",
                headers: authContentHeader()})
            .then(response => response.json())
            .then(data => {
                set2fa(data.twoFa);
            })
            .catch(error => {
                console.error('Error fetching 2FA state:', error);
            });
    };


    return ( <>
        <div style={{fontSize: "smaller", marginLeft: "110px", display: 'block', marginTop: "-10px"}}>TwoFa <span style={{ marginLeft: "60px" }}>{twoFa? "       enabled" : "      disabled"}</span></div>
            {!disableClicked && !qrCodeUrl && <Button styleP={{ position: 'absolute', top: '78%', right: "39.5%"}} name={twoFa === true? "Disable" : "Enable"} onClick={() => {handle2FaButtonClick()}} />}
            {qrCodeUrl && !twoFa && <form onSubmit={handleSubmitCode}>
                    <p>Please enter security code.</p>
                    <label htmlFor="securityCode"></label>
                <div style={{ padding: '10px', border: '2px solid black', display: 'inline-block', backgroundColor: '#f0f0f0' }}>
                    {qrCodeUrl && <QRCode value={qrCodeUrl} size={150} />}
                </div>
                    <input type="text" id="securityCode" name="securityCode" style={{width:"80px", marginRight: "50px", marginLeft: "57px", marginTop: "50px"}} onChange={handleCodeChaneg} />
                    <button className="btn-dark" type="submit" value={securityCode} style={{width: "80", marginTop: "10px", marginRight: "70px"}}>Submit</button>
            </form>}
            {
                disableClicked && <form onSubmit={handleSubmitCode}>
            <p style={{marginTop:"30px",}}>Please enter security code in order to disable two factor authentication.</p>
            <label htmlFor="securityCode"></label>
            <input type="text" id="securityCode" name="securityCode" style={{width:"80px", marginRight: "50px", marginLeft: "57px", marginTop: "0px"}} onChange={handleCodeChaneg} />
            <button className="btn-dark" type="submit" value={securityCode} style={{width: "80", marginTop: "10px", marginRight: "70px"}}>Submit</button>
            </form>
            }


   </> );
}

export default TwoFa;

