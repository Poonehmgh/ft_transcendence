import React from "react";
import { handleBlockUser, handleUnBlockUser } from "src/functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "../shared/DTO";

interface blockButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    switch (props.relation) {
        case UserRelation.blocked:
            return (
                <button onClick={() => handleUnBlockUser(props.otherProfile.id, props.otherProfile.name)}>
                    Unblock user
                </button>
            );

        default:
            return (
                <button onClick={() => handleBlockUser(props.otherProfile.id, props.otherProfile.name)}>
                    Block user
                </button>
            );
    }
}

export default BlockButton;
