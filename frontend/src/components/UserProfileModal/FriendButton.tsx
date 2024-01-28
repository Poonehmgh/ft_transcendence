import React from "react";
import {
    handleRemoveFriend,
    handleCancelRequest,
    handleAcceptRequest,
    handleDeclineRequest,
    handleSendFriendRequest,
    manageIncomingRequest,
} from "../../functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "../shared/DTO";

// CSS
import "src/styles/buttons.css";

interface FriendButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO | null;
    reRender: () => void;
}

function FriendButton(props: FriendButtonProps): React.JSX.Element | null {
    if (!props.otherProfile) return <div className="p">Loading data...</div>;
    if (props.relation === UserRelation.blocked)
        return <div className="p">Unblock to interact</div>;

    function doAction() {
        switch (props.relation) {
            case UserRelation.friends:
                handleRemoveFriend(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.request_sent:
                handleCancelRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.request_received:
                manageIncomingRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.blocked:
                // already handled
                break;
            case UserRelation.none:
                handleSendFriendRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            default:
                console.error("Unexpected relation:", props.relation);
        }
        props.reRender();
    }

    return (
        <button className="userActionButton" onClick={() => doAction()}>
            {props.relation === UserRelation.friends ? "Remove friend 💔" : null}
            {props.relation === UserRelation.request_sent
                ? "Cancel friend request"
                : null}
            {props.relation === UserRelation.request_received
                ? "Accept / decline friend request"
                : null}
            {props.relation === UserRelation.none ? "Send friend request 👋" : null}
        </button>
    );
}

export default FriendButton;
