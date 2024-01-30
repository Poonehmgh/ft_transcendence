import React, { useEffect, useState } from "react";
import UserTable from "../shared/UserTable";
import RankNumberColumn from "./RankNumberColumn";
import { fetchGetSet } from "src/functions/utils";

// DTO
import { UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/userTable.css";
import "src/styles/style.css";

function Leaderboard() {
    const [userList, setUserlist] = useState<UserProfileDTO[]>(null);
    const getTopN = 3;
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/leaderboard?top=" + getTopN;

    useEffect(() => {
        fetchGetSet<UserProfileDTO[]>(apiUrl, setUserlist);
    }, [apiUrl]);

    if (!userList)
        return (
            <div className="mainContainerRow">
                <div className="h2">Loading data...</div>
            </div>
        );

    if (userList.length === 0)
        return (
            <div className="mainContainerRow">
                <div className="h2">No games played.</div>
            </div>
        );

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">Leaderboard</div>
                <div className="tablesContainer">
                    {!userList ? null : <RankNumberColumn n={userList.length} />}
                    <UserTable users={userList} />
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
