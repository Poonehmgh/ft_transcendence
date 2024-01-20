import React, { useEffect, useState } from "react";
import Header from "../Header/Header_main";
import UserTable from "../shared/UserTable";
import RankNumberColumn from "./RankNumberColumn";

// CSS
import "src/styles/userTable.css";
import "src/styles/style.css"
import { UserProfileDTO } from "user-dto";
import { fetchGetSet } from "src/ApiCalls/fetchers";

function Leaderboard() {
    const [userList, setUserlist] = useState<UserProfileDTO[]>([]);
    const getTopN = 3;
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/leaderboard?top=" + getTopN;

    useEffect(() => {
        fetchGetSet(apiUrl, setUserlist);
    }, []);

    return (
            <div className="table-center">
                <div>
                    <div className = "h2" >Leaderboard</div>
                    <div className="tablesContainer">
                        <RankNumberColumn topN={userList.length}/>
                        <UserTable apiUrl={apiUrl} />
                    </div>
                </div>
            </div>
    );
}

export default Leaderboard;
