import React, {useEffect, useState} from "react";
import {ScoreCardDTO} from  "../../../backend/src/user/user-dto";

interface leaderBoardProp {
    n: number;
}

interface rowEntryProp {
    scoreCard: ScoreCardDTO;
    rank: number;
}

// async function fetchData and get rid of => wtf why are these things everywhere?!
const fetchData = async (n: number, setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>): Promise<void> => {
    try {
        const response = await fetch(`http://localhost:5500/user/leaderboard?top=${n}`);
        const data = await response.json();
        setter(data);
    } catch (error) {
        console.error('Error fetching leaderboard data:', error);
        setter([]);
    }
};


function LeaderBoard(props: leaderBoardProp): Element {
    const [leaderTable, setLeaderTable] = useState <ScoreCardDTO[]>([]);
    
    // outside function definition. Clean, but not all in one place
    useEffect(() => {
        fetchData(props.n, setLeaderTable);
    }, [props.n]);
    
    // all in one place, but not too clean
    // useEffect(()=> {
    //     (async ()=> {
    //         try {
    //             const response = await fetch(`http://localhost:5500/user/leaderboard?top=${props.n}`);
    //             const data = await response.json();
    //             setLeaderTable(data);
    //         } catch (error) {
    //             console.error('Error fetching leaderboard data:', error);
    //             // maybe rethrow, we are just printing here
    //         }
    //     })();
    // }, [props.n]);
    
    // inside function definition. All in one place, but bloats the UseEffect
    // const fetchAndUpdate = async (n: number): Promise<void> => {
    //     try {
    //         const response = await fetch(`http://localhost:5500/user/leaderboard?top=${n}`);
    //         const data = await response.json();
    //         setLeaderTable(data);
    //     } catch (error) {
    //         console.error('Error fetching leaderboard data:', error);
    //         // maybe rethrow? we just printing for now
    //     }
    // }
    //
    // useEffect(() => {
    //     fetchAndUpdate(props.n);
    // }, [props.n]);
    
    return (
        <ol>
            {leaderTable.map((element: ScoreCardDTO, index: number) => (
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
