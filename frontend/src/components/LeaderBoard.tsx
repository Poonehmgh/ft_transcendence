import React, {useEffect, useState} from "react";
import {ScoreCardDTO} from  "../../../backend/src/user/user-dto";

function  LeaderBoard  ({n}: {n: number}): HTMLDivElement
{
    const [leaderTable, setLeaderTable] = useState <ScoreCardDTO[]>([])
   console.log(`number: ${n}`);
    useEffect(() => {
        const fetchLeaderBoard = async  (): Promise<void> => {
            const response = await fetch(`http://localhost:5500/user/leaderboard?top=${n}`, {
                method: "Get",
                headers: {
                    //Authorization: `Bearer ${jscookies.get}`,
                    // accepted-content?
                },
            });
            const data:  ScoreCardDTO[] = await response.json();
            setLeaderTable(data);
        }

        void fetchLeaderBoard();
    }, []);

    return (
        <ol>
            {leaderTable.map(
                (element: ScoreCardDTO, idx: number) => (
                <RowEntry
                    scoreCard = { element }
                          rank = {idx + 1}/>
                ))}
        </ol>
    );
}

function RowEntry({scoreCard, rank}: {scoreCard: ScoreCardDTO, rank: number}) {
    return (
        <li key = { rank }>
           <span>{scoreCard.name} </span>
            <span> {scoreCard.badge} </span>
          <span>  {scoreCard.mmr} </span>
          <span>  {scoreCard.winrate} </span>
        </li>
    )
}

export default LeaderBoard;
