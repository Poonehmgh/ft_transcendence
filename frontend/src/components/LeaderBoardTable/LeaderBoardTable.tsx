import React, {useEffect, useState} from "react";
import { authContentHeader } from "src/ApiCalls/headers";
import { UserProfileDTO } from "user-dto";

interface leaderBoardProp {
    n: number;
}

function LeaderBoardTable(props: leaderBoardProp): React.JSX.Element {
    const [leaderTable, setLeaderTable] = useState <UserProfileDTO[]>([]);

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
        <table>
              <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Rank</th>
                <th>MMR</th>
                <th>Matches</th>
                <th>Win Rate</th>
              </tr>
              </thead>
              <tbody>
                {leaderTable.map((element: UserProfileDTO, index: number) => (
                    <tr key = {element.id}>
                        <td>{index + 1}</td>
                        <td>{element.name}</td>
                        <td>{element.rank}</td>
                        <td>{element.mmr}</td>
                        <td>{element.matches}</td>
                        <td>{element.winrate !== null ? element.winrate : "N/A"}</td>
                        <td>{element.online ? 'online' : 'offline'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const fetchAndSet = async (n: number, setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>): Promise<void> => {
    try {
        const apiUrl =  process.env.REACT_APP_BACKEND_URL + `/user/leaderboard?top=${n}`;
        const response = await fetch(apiUrl, {
            headers: authContentHeader()
        });
        const data = await response.json();
        setter(data);
    } catch (error) {
        console.error('Error fetching user/leaderboard:', error);
        setter([]);
    }
}

export default LeaderBoardTable;
