import React from "react";
import { blockUser, unblockUser } from "src/functions/userActions";

// DTO
import { UserRelation } from "../shared/DTO";

interface blockButtonProps {
    relation: UserRelation;
    otherId: number;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    switch (props.relation) {
        case UserRelation.blocked:
            return (
                <button onClick={void unblockUser(props.otherId)}>
                    Unblock user
                </button>
            );
        default:
            return (
                <button onClick={void blockUser(props.otherId)}>
                    Block user
                </button>
            );
    }
}

export default BlockButton;
