import React from "react";
import {
    handleRemoveFriend,
    handleCancelRequest,
    handleSendFriendRequest,
    handleIncomingRequest,
} from "../../../functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "src/dto/user-dto";

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
        return <div className="pInfo">Unblock to interact</div>;

    function doAction() {
        switch (props.relation) {
            case UserRelation.friends:
                handleRemoveFriend(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.request_sent:
                handleCancelRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.request_received:
                handleIncomingRequest(props.otherProfile.id, props.otherProfile.name);
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

    function selectTooltip() {
        switch (props.relation) {
            case UserRelation.friends:
                return "Remove friend";
            case UserRelation.request_sent:
                return "Cancel friend request";

            case UserRelation.request_received:
                return "Accept / decline friend request";

            case UserRelation.blocked:
                return ""; // already handled

            case UserRelation.none:
                return "Send friend request";
        }
    }

    function selectButtonText() {
        switch (props.relation) {
            case UserRelation.friends:
                return "💔";

            case UserRelation.request_sent:
                return "🤝❌";

            case UserRelation.request_received:
                return "👋";

            case UserRelation.blocked:
                return ""; // already handled

            case UserRelation.none:
                return "🤝";
        }
    }

    return (
        <button
            className="userActionButton"
            onClick={() => doAction()}
            data-tooltip={selectTooltip()}
        >
            {selectButtonText()}
        </button>
    );
}

export default FriendButton;
