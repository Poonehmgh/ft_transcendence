import React, { useEffect, useState } from "react";
import UserTable from "../shared/UserTable";
import { fetchGetSet } from "src/functions/utils";

import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/buttons.css";

function AllUsers() {
    const [users, setUsers] = useState<UserProfileDTO[]>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";

    useEffect(() => {
        fetchGetSet(apiUrl, setUsers);
    }, [apiUrl]);

    if (!users)
        return (
            <div className="mainContainerRow">
                <div>
                    <div className="h2">All Users</div>
                    <p>Loading data...</p>
                </div>
            </div>
        );

    const filteredUsers = users
        ? users.filter((user) =>
              user.name.toLowerCase().includes(searchQuery.toLowerCase())
          )
        : [];

    return (
        <div className="mainContainerRow">
            <div>
                <div className="h2">
                    All Users
                    <input
                        className="textInput"
                        style={{ width: "250px", marginTop: "20px" }}
                        type="text"
                        placeholder="🔎"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                {filteredUsers.length === 0 ? (
                    <p className="bigCenterEmoji">👻</p>
                ) : (
                    <div className="tablesContainer">
                        <UserTable users={filteredUsers} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllUsers;
