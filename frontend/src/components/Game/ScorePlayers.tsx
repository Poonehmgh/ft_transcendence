import React from "react";

interface IUserScore {
    scorePlayerOne: number;
    scorePlayerTwo: number;
}

const Score = () => { //have to add props
    return(
        <span className="baza">
            <div className="score-player">3    :    0</div>
        </span>
    );
}

export default Score;