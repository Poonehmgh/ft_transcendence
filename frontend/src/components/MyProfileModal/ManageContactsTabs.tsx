import React, { useState } from "react";
import "src/styles/modals.css";

function ManageContactsTabs() {
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
          🤝
        </button>
        <button
          className={
            activeTab === 1 ? "modal-tab-button_active" : "modal-tab-button_inactive"
          }
          onClick={() => handleTabClick(1)}
        >
          ⛔
        </button>
		<button
          className={
            activeTab === 2 ? "modal-tab-button_active" : "modal-tab-button_inactive"
          }
          onClick={() => handleTabClick(2)}
        >
          📤
        </button>
		<button
          className={
            activeTab === 3 ? "modal-tab-button_active" : "modal-tab-button_inactive"
          }
          onClick={() => handleTabClick(3)}
        >
          📥
        </button>
      </div>

      <div className="modal-tab-content">
        {activeTab === 0 && <div>Content for Tab 1</div>}
        {activeTab === 1 && <div>ConASDASDtent for Tab 2</div>}
        {activeTab === 2 && <div>Tab3</div>}
        {activeTab === 3 && <div>Tab4</div>}
        {/* Add content for additional tabs */}
      </div>
    </div>
  );
}

export default ManageContactsTabs;
