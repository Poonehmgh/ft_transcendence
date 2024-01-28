import React from "react";
import {
    handleRemoveFriend,
    handleCancelRequest,
    handleAcceptRequest,
    handleDeclineRequest,
    handleSendFriendRequest,
} from "../../functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "../shared/DTO";

// CSS
import "src/styles/buttons.css";

interface friendButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO;
}

function FriendButton(props: friendButtonProps): React.JSX.Element {
    switch (props.relation) {
        case UserRelation.friends:
            return (
                <button
                    onClick={() =>
                        handleRemoveFriend(props.otherProfile.id, props.otherProfile.name)
                    }
                >
                    Remove friend
                </button>
            );
        case UserRelation.request_sent:
            return (
                <button
                    onClick={() =>
                        handleCancelRequest(
                            props.otherProfile.id,
                            props.otherProfile.name
                        )
                    }
                >
                    Cancel friend request
                </button>
            );
        case UserRelation.request_received:
            return (
                <div>
                    <button
                        onClick={() =>
                            handleAcceptRequest(
                                props.otherProfile.id,
                                props.otherProfile.name
                            )
                        }
                    >
                        Accept friend request
                    </button>
                    <button
                        onClick={() =>
                            handleDeclineRequest(
                                props.otherProfile.id,
                                props.otherProfile.name
                            )
                        }
                    >
                        Decline friend request
                    </button>
                </div>
            );
        case UserRelation.blocked:
            return <div />;
        case UserRelation.none:
            return (
                <button
                    className="textButton"
                    onClick={() =>
                        handleSendFriendRequest(
                            props.otherProfile.id,
                            props.otherProfile.name
                        )
                    }
                >
                    💌
                </button>
            );
        default:
            return <p>Error resolving relation between users.</p>;
    }
}
export default FriendButton;
