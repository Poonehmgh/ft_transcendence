import React, { useState, useEffect } from "react";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { MatchInfoDTO } from "match-dto";

// CSS
import "src/styles/stlye.css";
import "src/styles/matchHistory.css";

interface matchHistoryProp {
    id: number;
}

function MatchHistory(props: matchHistoryProp) {
    const [matches, setMatches] = useState<MatchInfoDTO[]>(null);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/match";

    useEffect(() => {
        fetchGetSet<MatchInfoDTO[]>(apiUrl, setMatches);
    }, []);

    function getCalendarDay(date: Date) {
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();

        return `${day}.${month}.${year}`;
    }

    return (
        <table className="matchHistoryTable">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Duration</th>
                    <th>Player1</th>
                    <th>Player2</th>
                    <th>Winner</th>
                </tr>
            </thead>
            <tbody>
                {matches.map((element: MatchInfoDTO, index: number) => (
                    <tr key={index}>
                        <td>{getCalendarDay(element.begin)}</td>
                        <td>
                            <button
                                className="textButton"
                                onClick={() => handleNameClick(element.id)}
                            >
                                {element.name}
                            </button>
                        </td>
                        <td>{element.rank}</td>
                        <td>{element.mmr}</td>
                        <td>{element.matches}</td>
                        <td>{element.winrate !== null ? element.winrate : "N/A"}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default MatchHistory;
