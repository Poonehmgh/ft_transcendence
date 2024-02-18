import React, { useEffect, useState } from "react";
import UserTable from "../shared/UserTable";
import RankNumberColumn from "./RankNumberColumn";
import LoadingH2 from "src/components/shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "utils";

// DTO
import { UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/userTable.css";
import "src/styles/style.css";

function Leaderboard() {
    const [userList, setUserlist] = useState<UserProfileDTO[]>(null);
    const getTopN = 3;

    useEffect(() => {
        async function fetchUserList() {
            const apiUrl = backendUrl.user + "leaderboard?top=" + getTopN;
            const data = await fetchWrapper<UserProfileDTO[]>("GET", apiUrl, null);
            setUserlist(data);
        }
    }, []);

    if (userList === null) return <LoadingH2 elementName={"Leaderboard"} />;
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
