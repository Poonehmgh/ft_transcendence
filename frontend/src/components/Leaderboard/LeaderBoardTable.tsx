import React, {useEffect, useState} from "react";
import { authContentHeader } from "src/ApiCalls/headers";
import { UserProfileDTO } from "src/DTO/user-dto";

interface leaderBoardProp {
    n: number;
}

interface rowEntryProp {
    userProfile: UserProfileDTO;
    ladderPos: number;
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
        <tbody>
          {leaderTable.map((element: UserProfileDTO, index: number) => (
              <RowEntry userProfile = {element} ladderPos = {index + 1}/>
          ))}
        </tbody>
    );
}

const fetchAndSet = async (n: number, setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>): Promise<void> => {
    try {
        const url =  process.env.REACT_APP_BACKEND_URL + `/user/leaderboard?top=${n}`;
		const response = await fetch(url);
        const data = await response.json();
        setter(data);
    } catch (error) {
        console.error('Error fetching user/leaderboard:', error);
        setter([]);
    }
}

function RowEntry(props: rowEntryProp): React.JSX.Element {

	
	return (
        <tr key = {props.userProfile.id}>
            <td>{props.ladderPos}</td>
            <td>{props.userProfile.name}</td>
            <td>{props.userProfile.rank}</td>
            <td>{props.userProfile.mmr}</td>
            <td>{props.userProfile.matches}</td>
            <td>{props.userProfile.winrate !== null ? props.userProfile.winrate : "N/A"}</td>
            <td>{props.userProfile.online ? 'online' : 'offline'}</td>
        </tr>
    )
}

export default LeaderBoardTable;
