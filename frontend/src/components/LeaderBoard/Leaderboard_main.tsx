import React, { useEffect, useState } from "react";
import UserTable from "../shared/UserTable";
import RankNumberColumn from "./RankNumberColumn";
import { UserProfileDTO } from "user-dto";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// CSS
import "src/styles/userTable.css";
import "src/styles/style.css";

function Leaderboard() {
    const [userList, setUserlist] = useState<UserProfileDTO[]>(null);
    const getTopN = 3;
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/leaderboard?top=" + getTopN;

    useEffect(() => {
        fetchGetSet(apiUrl, setUserlist);
    }, [apiUrl]);

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
