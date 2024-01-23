import React from "react";
import {
    acceptRequest,
    addFriend,
    cancelRequest,
    declineRequest,
    removeFriend,
} from "../../functions/userActions";

// DTO
import { UserRelation } from "user-dto";

interface friendButtonProps {
    relation: UserRelation;
    thisId: number;
    otherId: number;
}

function FriendButton(props: friendButtonProps): React.JSX.Element {
    switch (props.relation) {
        case UserRelation.friends:
            return (
                <button onClick={() => removeFriend(props.thisId, props.otherId)}>
                    Remove friend
                </button>
            );
        case UserRelation.request_sent:
            return (
                <button onClick={() => cancelRequest(props.thisId, props.otherId)}>
                    Cancel friend request
                </button>
            );
        case UserRelation.request_received:
            return (
                <div>
                    <button onClick={() => acceptRequest(props.thisId, props.otherId)}>
                        Accept friend request
                    </button>
                    <button onClick={() => declineRequest(props.thisId, props.otherId)}>
                        Decline friend request
                    </button>
                </div>
            );
        case UserRelation.blocked:
            return <div />;
        case UserRelation.none:
            return (
                <button onClick={() => addFriend(props.thisId, props.otherId)}>
                    Add friend
                </button>
            );
        default:
            return (
                <button
                    onClick={() =>
                        console.error("Error resolving relation between users")
                    }
                >
                    Error
                </button>
            );
    }
}
export default FriendButton;
