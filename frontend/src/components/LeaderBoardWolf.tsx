import React, {useEffect, useState} from "react";
import {ScoreCardDTO} from  "../../../backend/src/user/user-dto";

interface leaderBoardProp {
    n: number;
}

interface rowEntryProp {
    scoreCard: ScoreCardDTO;
    rank: number;
}

function LeaderBoardWolf(props: leaderBoardProp): React.JSX.Element {
    const [leaderTable, setLeaderTable] = useState <ScoreCardDTO[]>([]);

    useEffect(() => {
        void fetchAndSet(props.n, setLeaderTable);
    }, [props.n]);

    if (leaderTable.length === 0)
        return (
            <div>
                <br/>No matches played.
            </div>
        );
    return (
        <ol>
            {leaderTable.map((element: ScoreCardDTO, index: number) => (
                <RowEntry scoreCard = {element} rank = {index + 1}/>
            ))}
        </ol>
    );
}

const fetchAndSet = async (n: number, setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5500/user/leaderboard?top=${n}`);
        const data = await response.json();
        setter(data);
    } catch (error) {
        console.error('Error fetching user/leaderboard:', error);
        setter([]);
    }
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

export default LeaderBoardWolf;
