import React from "react";

interface IUserScore {
    scorePlayerOne: number;
    scorePlayerTwo: number;
}

const Score = (props: IUserScore) => { //have to add props
    return(
        <span className="baza">
            <div className="score-player">{props.scorePlayerOne}    :    {props.scorePlayerTwo}</div>
        </span>
    );
}

export default Score;