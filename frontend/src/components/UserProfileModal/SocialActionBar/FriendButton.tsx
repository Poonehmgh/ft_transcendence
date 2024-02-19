import React, { useContext } from "react";

// Contexts
import { SocialDataContext } from "src/contexts/SocialDataProvider";

// DTO
import { UserProfileDTO, UserRelation } from "src/dto/user-dto";

// CSS
import "src/styles/buttons.css";

interface FriendButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO | null;
}

function FriendButton(props: FriendButtonProps): React.JSX.Element | null {
    const {
        sendFriendRequest,
        cancelFriendRequest,
        acceptRequest,
        declineRequest,
        removeFriend,
    } = useContext(SocialDataContext);

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
            case UserRelation.none:
                sendFriendRequest(props.otherProfile.id, props.otherProfile.name);
                break;
        }
    }

    function selectTooltip() {
        switch (props.relation) {
            case UserRelation.friends:
                return "Remove friend";
            case UserRelation.request_sent:
                return "Cancel friend request";
            case UserRelation.none:
                return "Send friend request";
            default:
                return "🤷";
        }
    }

    function selectButtonText() {
        switch (props.relation) {
            case UserRelation.friends:
                return "💔";
            case UserRelation.request_sent:
                return "🤝❌";
            case UserRelation.none:
                return "🤝";
        }
    }

    return (
        <div>
            {props.relation === UserRelation.request_received && (
                <>
                    <button
                        className="userActionButton"
                        onClick={() =>
                            acceptRequest(props.otherProfile.id, props.otherProfile.name)
                        }
                        data-tooltip="Accept friend request"
                    >
                        Accept
                    </button>
                    <button
                        className="userActionButton"
                        onClick={() =>
                            declineRequest(props.otherProfile.id, props.otherProfile.name)
                        }
                        data-tooltip="Decline friend request"
                    >
                        Decline
                    </button>
                </>
            )}
            {props.relation !== UserRelation.request_received && (
                <button
                    className="userActionButton"
                    onClick={() => doAction()}
                    data-tooltip={selectTooltip()}
                >
                    {selectButtonText()}
                </button>
            )}
        </div>
    );
}

export default FriendButton;
