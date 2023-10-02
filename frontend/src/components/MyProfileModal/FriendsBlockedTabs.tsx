import React, { useState } from "react";
import "src/styles/modals.css";

function FriendsBlockedTabs() {
  const [activeTab, setActiveTab] = useState(0);

  function handleTabClick(index: number) {
    setActiveTab(index);
  }

  return (
    <div className="modal-tabs-container">
      <div className="modal-tab-buttons">
        <button
          className={
            activeTab === 0 ? "modal-tab-button_active" : "modal-tab-button_inactive"
          }
          onClick={() => handleTabClick(0)}
        >
          Friends
        </button>
        <button
          className={
            activeTab === 1 ? "modal-tab-button_active" : "modal-tab-button_inactive"
          }
          onClick={() => handleTabClick(1)}
        >
          Blocked
        </button>
        {/* Add more tabs as needed */}
      </div>

      <div className="modal-tab-content">
        {activeTab === 0 && <div>Content for Tab 1</div>}
        {activeTab === 1 && <div>ConASDASDtent for Tab 2</div>}
        {/* Add content for additional tabs */}
      </div>
    </div>
  );
}

export default FriendsBlockedTabs;
