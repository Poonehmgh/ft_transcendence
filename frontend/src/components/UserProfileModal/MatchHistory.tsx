import React, { useContext, useEffect, useState } from "react";
import { fetchWrapper, getCalendarDay } from "src/functions/utils";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { AuthContext } from "src/contexts/AuthProvider";

// DTO
import { MatchDTO } from "src/dto/match-dto";

// CSS
import "src/styles/style.css";
import "src/styles/matchHistory.css";

interface matchHistoryProps {
    id: number;
}

function MatchHistory(props: matchHistoryProps): React.JSX.Element {
    const { userId } = useContext(AuthContext);
    const [matches, setMatches] = useState<MatchDTO[]>(null);

    useEffect(() => {
        async function fetchMatches() {
            const apiUrl = backendUrl.user + "matches/" + props.id;
            const data = await fetchWrapper<MatchDTO[]>("GET", apiUrl, null);
            setMatches(data);
        }

        fetchMatches();
    }, [props.id]);

    if (matches === null) return <div className="p">Loading data...</div>;
    if (!Array.isArray(matches)) return <div className="p">Loading data...</div>;
    if (matches.length === 0) return <div className="p">No matches played.</div>;

    console.log("matches", matches)
    console.log("userId", userId)

    return (
        <div style={{ marginBottom: "20px" }}>
            <div className="h2Left" style={{ fontSize: "1.4rem" }}>
                Match History
            </div>
            <table className="matchHistoryTable">
                <thead>
                    <tr>
                        <th>Date</th>
                        <th>{"Opponent"}</th>
                        <th>Score</th>
                        <th>Result</th>
                    </tr>
                </thead>
                <tbody>
                    {matches.map((e: MatchDTO) => (
                        <tr key={e.id}>
                            <td>{getCalendarDay(e.begin)}</td>
                            <td>{props.id !== e.player1Id ? e.player1Name : e.player2Name}</td>
                            <td style={{ textAlign: "center" }}>
                                {e.player1Score} - {e.player2Score}
                            </td>
                            <td style={{ textAlign: "center" }}>
                                {e.winnerId === null
                                    ? "draw"
                                    : e.winnerId === props.id
                                    ? "🏆"
                                    : "💥"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MatchHistory;
