import React from "react";

// CSS
import "src/styles/playerCardTable.css";

interface playerCardTableProp {
    mmr: number;
    rank: string;
    matches: number;
    winrate: number;
    twoFa?: boolean;
}

function PlayerCardTable(props: playerCardTableProp) {
    return (
        <div>
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
                        <td> 2fa</td>
                        <td>{props.twoFa ? "enabled" : "disabled"}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default PlayerCardTable;
