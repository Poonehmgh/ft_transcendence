import React, { useContext } from "react";
import {
    handleIncomingRequest,
} from "../../../functions/userActions";

// Contexts
import { UserDataContext } from "src/contexts/UserDataProvider";

// DTO
import { UserProfileDTO, UserRelation } from "src/dto/user-dto";

// CSS
import "src/styles/buttons.css";

interface FriendButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO | null;
}

function FriendButton(props: FriendButtonProps): React.JSX.Element | null {
    const { sendFriendRequest, cancelFriendRequest, removeFriend } = useContext(UserDataContext);

    if (!props.otherProfile) return <div className="p">Loading data...</div>;
    if (props.relation === UserRelation.blocked)
        return <div className="pInfo">Unblock to interact</div>;

    function doAction() {
        switch (props.relation) {
            case UserRelation.friends:
                removeFriend(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.request_sent:
                cancelFriendRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.request_received:
                handleIncomingRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            case UserRelation.blocked:
                // already handled
                break;
            case UserRelation.none:
                sendFriendRequest(props.otherProfile.id, props.otherProfile.name);
                break;
            default:
                console.error("Unexpected relation:", props.relation);
        }
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
