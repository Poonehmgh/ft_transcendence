import React from "react";
import { handleBlockUser, handleUnBlockUser } from "src/functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "src/dto/user-dto";

interface blockButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    function doBlockUser(id: number, name: string) {
        handleBlockUser(id, name);
    }

    function doUnblockUser(id: number, name: string) {
        handleUnBlockUser(id, name);
    }

    return (
        <button
            className="userActionButton"
            data-tooltip={props.relation === UserRelation.blocked ? "Unblock" : "Block"}
            onClick={() => {
                props.relation === UserRelation.blocked
                    ? doUnblockUser(props.otherProfile.id, props.otherProfile.name)
                    : doBlockUser(props.otherProfile.id, props.otherProfile.name);
            }}
        >
            {props.relation === UserRelation.blocked ? "🕊️" : "🚫"}
        </button>
    );
}

export default BlockButton;
