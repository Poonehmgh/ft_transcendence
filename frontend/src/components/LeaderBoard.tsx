import React, {useEffect, useState} from "react";
import {ScoreCardDTO} from  "../../../backend/src/user/user-dto";

interface NumberOfEntries {
    n: number;
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


function LeaderBoard(props: NumberOfEntries): Element
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
