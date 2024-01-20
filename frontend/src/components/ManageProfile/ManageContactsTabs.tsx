import React, { useState } from "react";
import FriendList from "./FriendList";
import BlockedList from "./BlockedList";
import RequestInList from "./RequestInList";
import RequestOutList from "./RequestOutList";

// CSS
import "src/styles/manageProfile.css";

interface manageContactsTabsProps {
  id: number;
}

function ManageContactsTabs(props: manageContactsTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  function handleTabClick(index: number) {
    setActiveTab(index);
  }

  return (
    <div className="tabsContainer">
      <div className="tabButtonsContainer">
        <button
          className={
            activeTab === 0 ? "tabButton_active" : "tabButton_inactive"
          }
          onClick={() => handleTabClick(0)}
        >
          🤝
        </button>
        <button
          className={
            activeTab === 1 ? "tabButton_active" : "tabButton_inactive"
          }
          onClick={() => handleTabClick(1)}
        >
          ⛔
        </button>
        <button
          className={
            activeTab === 2 ? "tabButton_active" : "tabButton_inactive"
          }
          onClick={() => handleTabClick(2)}
        >
          📥
        </button>
        <button
          className={
            activeTab === 3 ? "tabButton_active" : "tabButton_inactive"
          }
          onClick={() => handleTabClick(3)}
        >
          📤
        </button>
      </div>

      <div className="tabContent">
        {activeTab === 0 && <FriendList id={props.id} />}
        {activeTab === 1 && <BlockedList id={props.id} />}
        {activeTab === 2 && <RequestInList id={props.id} />}
        {activeTab === 3 && <RequestOutList id={props.id} />}
      </div>
    </div>
  );
}

export default ManageContactsTabs;
