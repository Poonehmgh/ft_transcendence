import Header from "../Header/Header_main";
import React from "react";
import UserTable from "../shared/UserTable";

// CSS
import "src/styles/style.css";

function AllUsers() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";

    return (
            <div className="table-center">
                <div>
                    <div className="h2" >All Users</div>
                    <div className="tablesContainer">
                        <UserTable apiUrl={apiUrl} />
                    </div>
                </div>
            </div>
    );
}

export default AllUsers;
