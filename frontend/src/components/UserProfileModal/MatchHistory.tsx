import React, { useEffect, useState } from "react";
import { fetchGetSet, getCalendarDay } from "src/functions/utils";

// DTO
import { MatchDTO } from "match-dto";
import { UserProfileDTO } from "../shared/DTO";

// CSS
import "src/styles/style.css";
import "src/styles/matchHistory.css";

interface matchHistoryProps {
    id: number;
}

function MatchHistory(props: matchHistoryProps): React.JSX.Element {
    const [matches, setMatches] = useState<MatchDTO[]>(null);
    //const [player1, setPlayer1] = useState<UserProfileDTO>(null);
    //const [player2, setPlayer2] = useState<UserProfileDTO>(null);
    const apiUrl_matches =
        process.env.REACT_APP_BACKEND_URL + "/user/matches/" + props.id;
    //const apiUrl_p1 = process.env.REACT_APP_BACKEND_URL + "/user/profile/" + ;

    useEffect(() => {
        fetchGetSet<MatchDTO[]>(apiUrl_matches, setMatches);
    }, [apiUrl_matches]);

    if (!matches) return <div className="p">Loading data...</div>;
    if (matches.length === 0) return <div className="p">No matches played.</div>;

    return (
        <div style={{ marginBottom: "20px" }}>
            <div className="h2Left" style={{ fontSize: "1.4rem" }}>
                Match History
            </div>
            <table className="matchHistoryTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>{"Player 1 \n (score)"}</th>
                        <th>{"Player 2 \n (score)"}</th>
                        <th>Winner</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((element: MatchDTO) => (
                        <tr key={element.id}>
                            <td>{getCalendarDay(element.begin)}</td>
                            <td>
                                {element.player1_id}
                                <br />
                                {`(${element.score_p1})`}
                            </td>
                            <td>
                                {element.player2_id}
                                <br />
                                {`(${element.score_p2})`}
                            </td>
                            <td>
                                {element.winner_name ? element.winner_name : "- DRAW -"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MatchHistory;
