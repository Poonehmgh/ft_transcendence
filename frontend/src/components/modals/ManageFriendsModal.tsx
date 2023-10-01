import React, { useState, useEffect, useRef } from "react";
import { Tab, Tabs } from "react-bootstrap";
import Modal from "react-modal";
import { UserProfileDTO } from "user-dto";
import { authContentHeader } from "src/ApiCalls/headers";
import "src/styles/modals.css";

interface ManageFriendsModal_prop {
  id: number;
}

function ManageFriendsModal(props: ManageFriendsModal_prop) {
  return (
    <div>
      <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example" className="mb-3">
        <Tab eventKey="home" title="Home">
          Tab content for Home
        </Tab>
        <Tab eventKey="profile" title="Profile">
          Tab content for Profile
        </Tab>
        <Tab eventKey="contact" title="Contact" disabled>
          Tab content for Contact
        </Tab>
      </Tabs>
    </div>
  );
}

export default ManageFriendsModal;
