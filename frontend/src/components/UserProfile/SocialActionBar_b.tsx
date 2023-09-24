import React from "react";

enum SocialStatus {
  friends,
  request_sent,
  request_received,
  blocked,
  none
}

interface SocialActionBar_b_prop {
    relation: SocialStatus
}

function SocialActionBar_b(props: SocialActionBar_b_prop): React.JSX.Element {
    switch (props.relation) {
        case SocialStatus.blocked:
            return (<button onClick={void handleUnblockUser}>Unblock user</button>);
        default:
            return (<button onClick={void handleBlockUser}>Block user</button>);
    }
}

function  handleBlockUser(userId: number, otherId: number): void {
  // send block request to backend;
}

function handleUnblockUser(userId: number, otherId: number): void {
  // send unblock request to backend;
}

export default SocialActionBar_b;
