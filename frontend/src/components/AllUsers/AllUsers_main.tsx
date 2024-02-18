import React, { useEffect, useState } from "react";
import UserTable from "../shared/UserTable";
import LoadingH2 from "../shared/LoadingH2";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "src/functions/utils";

// DTO
import { UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/style.css";
import "src/styles/buttons.css";

function AllUsers() {
    const [users, setUsers] = useState<UserProfileDTO[]>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");

    useEffect(() => {
        async function fetchUsers() {
            const apiUrl = backendUrl.user + "all_users";
            const data = await fetchWrapper<UserProfileDTO[]>("GET", apiUrl, null);
            setUsers(data);
        }

        fetchUsers();
    }, []);

    if (!users) return <LoadingH2 elementName={"All Users"} />;

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
