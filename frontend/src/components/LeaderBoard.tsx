import React, {useEffect, useState} from "react";
import {ScoreCardDTO} from  "../../../backend/src/user/user-dto";

interface leaderBoardProp {
    n: number;
}

interface rowEntryProp {
    scoreCard: ScoreCardDTO;
    rank: number;
}

const fetchData = async (n: number): Promise<ScoreCardDTO[]> => {
    const response: Response = await fetch(`http://localhost:5500/user/leaderboard?top=${n}`, {
        method: "Get",
        headers: {
            //Authorization: `Bearer ${jscookies.get}`,
            // accepted-content?
        },
    });
    return await response.json();
}

function LeaderBoard(props: leaderBoardProp): Element
{
    const [leaderTable, setLeaderTable] = useState <ScoreCardDTO[]>([])
    useEffect((): void => {
        const fetchLeaderBoard = async (): Promise<void> => {
            const data = await fetchData(props.n)
            setLeaderTable(data);
        }
        void fetchLeaderBoard();
    }, [props.n]);

    return (
        <ol>
            {leaderTable.map(
                (element: ScoreCardDTO, index: number) => (
                    <RowEntry scoreCard = {element} rank = {index + 1}/>
                ))}
        </ol>
    );
}

function RowEntry(props: rowEntryProp): React.JSX.Element {
    return (
        <li key = {props.rank}>
            <span>{props.scoreCard.name} </span>
            <span style={{ fontStyle: 'italic' }}>the {props.scoreCard.title}</span>
            <span> | mmr: {props.scoreCard.mmr} </span>
            <span> | matches: {props.scoreCard.matches} </span>
            <span> | winrate: {props.scoreCard.winrate !== null ? props.scoreCard.winrate : "N/A"}</span>
        </li>
    )
}

export default LeaderBoard;
