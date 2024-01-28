import React, { useState } from "react";
import { handleBlockUser, handleUnBlockUser } from "src/functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "../shared/DTO";

interface blockButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO;
    reRender: () => void;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    function doBlockUser(id: number, name: string) {
        handleBlockUser(id, name);
        props.reRender();
    }

    function doUnblockUser(id: number, name: string) {
        handleUnBlockUser(id, name);
        props.reRender();
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
