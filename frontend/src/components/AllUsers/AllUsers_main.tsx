import Header from "../Header/Header_main";
import React from "react";
import "../../styles/tableElement.css";
import AllUsersTable from "./AllUsersTable";

function AllUsers() {
  return (
    <div className="sections-container">
      <Header />
      <div className="table-center">
        <div>
          <h2>All Users</h2>
          <AllUsersTable startIndex={0} n={10} />
        </div>
      </div>
    </div>
  );
}

export default AllUsers;
