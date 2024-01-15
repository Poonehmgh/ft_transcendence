import Header from "./Header";
import React from "react";
import '../styles/tableElement.css';
import AllUsersTable from "./AllUsersTable/AllUsersTable";

function AllUsers() {
    return (
		<div className="sections-container">
        <Header />
		<div className="table-center">
          <div>
            <h2>All Users</h2>
			<AllUsersTable n = {10} />
          </div>
        </div>
      </div>
    );
}

export default AllUsers;
