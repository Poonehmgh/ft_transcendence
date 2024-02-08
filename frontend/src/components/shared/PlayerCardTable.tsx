import React, { useState } from "react";

// CSS
import "src/styles/playerCardTable.css";
import Button from "./Button";
import { authContentHeader } from "src/functions/utils";
import  {QRCode} from 'react-qr-code';

interface playerCardTableProp {
    mmr: number;
    rank: string;
    matches: number;
    winrate: number;
    twoFa: boolean;
}

function PlayerCardTable(props: playerCardTableProp) {
    const [qrCodeUrl, setQrCodeUrl] = useState('');

    const handle2FaButtonClick = () => {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/auth/42/2fa";
        fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
        }).then(response => {
            if (!response.ok)
                throw new Error("Failed to enable 2Fa");
             return response.json();}).then(data=>{
            const qrURL = data.url;
            if (!qrURL)
                throw new Error("Failed to get qrURL");
            setQrCodeUrl(qrURL);
        }).catch(error => {
            console.log("Error in handle2FaButtonClick", error);
        })

    }


    return ( <>
        {!qrCodeUrl && <div>
        <table className="playerCardTable">
            <tbody>
                <tr>
                    <td>mmr</td>
                    <td>{props.mmr}</td>
                </tr>
                <tr>
                    <td>rank</td>
                    <td>{props.rank}</td>
                </tr>
                <tr>
                    <td>matches</td>
                    <td>{props.matches}</td>
                </tr>
                <tr>
                    <td>win rate</td>
                    <td>{props.winrate ? props.winrate : "-"}</td>
                </tr>
                <tr>
                    <td>2FA</td>
                    <td>{props.twoFa ===true ? "enabled" : "disabled"}
                    </td>
                </tr>
            </tbody>
        </table>
        <Button name={props.twoFa === true? "Disable" : "Enable"} onClick={() => {handle2FaButtonClick()}} />
    </div>}
    <div>
        <p>Please enter security code.</p>
        {qrCodeUrl && <form>
            <label htmlFor="securityCode"></label>
            {qrCodeUrl && <QRCode value={qrCodeUrl} size={150} style={{marginTop: '0px', marginBottom: '10px'}}/>}
            <input type="text" id="securityCode" name="securityCode" style={{width:"80px", marginRight: "0px"}} />
            <button className="btn-dark" type="submit" style={{width: "80", marginTop: "10px", marginRight: "70px"}}>Submit</button>
            </form>}
    </div>
    </>
    );
}




export default PlayerCardTable;
