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
    const [leaderTable, setLeaderTable] = useState <ScoreCardDTO[]>([])
    useEffect(() => {
        void fetchAndSet(props.n, setLeaderTable);
    }, [props.n]);
    
    return (
        <tbody>
        {leaderTable.map((element: ScoreCardDTO, index: number) => (
            <RowEntry scoreCard = {element} rank = {index + 1}/>
        ))}
        </tbody>
    );
}

const fetchAndSet = async (n: number, setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5500/user/leaderboard?top=${n}`);
        const data = await response.json();
        setter(data);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setter([]);
    }
};

function RowEntry(props: rowEntryProp): React.JSX.Element {
    return (
        <tr key = {props.rank}>
            <td>{props.scoreCard.name} the {props.scoreCard.title} </td>
            <td>{props.scoreCard.mmr} </td>
            <td>{props.scoreCard.matches} </td>
            <td>{props.scoreCard.winrate !== null ? props.scoreCard.winrate : "N/A"}</td>
        </tr>
    )
}

export default LeaderBoardWolf;