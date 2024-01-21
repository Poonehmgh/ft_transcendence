import React from "react";

// CSS
import "src/styles/playerCardTable.css";

interface playerCardTable_prop {
    mmr: number;
    rank: string;
    matches: number;
    winrate: number;
}

function PlayerCardTable(props: playerCardTable_prop) {
    return (
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
            </tbody>
        </table>
    );
}

export default PlayerCardTable;
