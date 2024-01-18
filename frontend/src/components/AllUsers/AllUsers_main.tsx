import Header from "../Header/Header_main";
import React from "react";
import UserTable from "../shared/UserTable";

// CSS
import "src/styles/tableElement.css";

function AllUsers() {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/all_users";

    return (
        <div className="sections-container">
            <Header />
            <div className="table-center">
                <div>
                    <h2>All Users</h2>
                    <UserTable apiUrl={apiUrl} />
                </div>
            </div>
        </div>
    );
}

export default AllUsers;
