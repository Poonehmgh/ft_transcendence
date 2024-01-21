import React, { useEffect, useState } from "react";
import UserTable from "../shared/UserTable";
import { fetchGetSet } from "src/ApiCalls/fetchers";
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/style.css";

function AllUsers() {
    const [userList, setUserlist] = useState<UserProfileDTO[]>([]);
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";

    useEffect(() => {
        fetchGetSet(apiUrl, setUserlist);
    }, []);

    return (
        <div className="table-center">
            <div>
                <div className="h2">All Users</div>
                <div className="tablesContainer">
                    <UserTable users={userList} />
                </div>
            </div>
        </div>
    );
}

export default AllUsers;
