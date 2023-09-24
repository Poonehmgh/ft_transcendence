import React from "react";
import { userAction } from "../../ApiCalls/userActions";

enum SocialStatus {
  friends,
  request_sent,
  request_received,
  blocked,
  none
}

interface SocialActionBar_a_prop {
    relation: SocialStatus
}

function SocialActionBar_a(props: SocialActionBar_a_prop): React.JSX.Element {
    switch (props.relation) {
        case SocialStatus.friends:
            return (
            <button
                onClick={() => userAction(2, "rm_friend")}>
                Remove friend
            </button>
        );
        case SocialStatus.request_sent:
            return (
                <button
                    onClick={() => userAction(2, "cancel_friendReq")}>
                    Cancel friend request
                </button>
            );
        case SocialStatus.request_received:
            return (
                <div>
                    <button
                        onClick={() => userAction(2, "accept_friendReq")}>
                        Accept friend request
                    </button>
                    <button
                        onClick={() => userAction(2, "decline_friendReq")}>
                        Decline friend request
                    </button>
                </div>
            );
        case SocialStatus.blocked:
            return (<div/>);
        case SocialStatus.none:
            return (
                <button
                    onClick={() => userAction(2, "add_friend")}>
                    Add friend
                </button>);
        default:
            return (
                <button
                    onClick={() => console.error('Error resolving relation between users')}>
                    Error
                </button>);
    }
}
export default SocialActionBar_a;
