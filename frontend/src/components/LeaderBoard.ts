import React, {useEffect, useState} from "react";

function LeaderBoard(): void{
    const [leaderBoardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchLeaderBoardData(){
            try {
                const response = await axios.get('/user/l')
            }
        }
    }, []);
}
