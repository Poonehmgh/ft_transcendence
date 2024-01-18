import React from "react";
import Header from "../Header/Header_main";
import UserTable from "../shared/UserTable";
import RankNumberColumn from "./RankNumberColumn";

// CSS
import "src/styles/tableElement.css";
import "src/styles/userTable.css";

function Leaderboard() {
    const getTopN = 3;
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/leaderboard?top=" + getTopN;


    return (
        <div className="sections-container">
            <Header />
            <div className="table-center">
                <div>
                    <h2>Leaderboard</h2>
                    <div className="tablesContainer">
                        <RankNumberColumn topN={getTopN}/>
                        <UserTable apiUrl={apiUrl} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Leaderboard;
