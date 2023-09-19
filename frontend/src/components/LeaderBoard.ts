import React, {useEffect, useState} from "react";

function LeaderBoard(): Promise<void> {
    const [leaderBoardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderBoardData(){
            const n: 10;
            const apiUrl :'http://localhost:5500/user/leaderboard?top=${n}';

            try {
                const response = await fetch('/user/leaderboard?=10')
            }
        }
    }, []);
}

async function fetchData(): Promise<any> {
    const n: 10;
    const apiUrl :'http://localhost:5500/user/leaderboard?top=${n}';
    try {
        const response = await fetch(apiUrl);
        if (!reponse.ok) {
            throw new Error((`Fetch failed. Status: ${response.status}`))
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error("Error", error);
    }
    return data;
}
