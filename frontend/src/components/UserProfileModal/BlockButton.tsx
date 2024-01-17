import React from "react";
import { blockUser, unblockUser } from "src/ApiCalls/userActions";

// DTO
import { UserRelation } from "../../DTO/user-dto";

interface blockButtonProps {
    relation: UserRelation;
    thisId: number;
    otherId: number;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    switch (props.relation) {
        case UserRelation.blocked:
            return (
                <button onClick={void unblockUser(props.thisId, props.otherId)}>
                    Unblock user
                </button>
            );
        default:
            return (
                <button onClick={void blockUser(props.thisId, props.otherId)}>
                    Block user
                </button>
            );
    }
}

export default BlockButton;
