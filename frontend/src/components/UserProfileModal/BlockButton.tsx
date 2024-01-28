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
    const [isBlocked, setIsBlocked] = useState(props.relation === UserRelation.blocked);

    function doBlockUser(id: number, name: string) {
        handleBlockUser(id, name);
        setIsBlocked(true);
        props.reRender();
    }

    function doUnblockUser(id: number, name: string) {
        handleUnBlockUser(id, name);
        setIsBlocked(false);
        props.reRender();
    }

    return (
        <button
            className="userActionButton"
            data-tooltip={isBlocked ? "Unblock" : "Block"}
            onClick={() => {
                if (isBlocked) {
                    doUnblockUser(props.otherProfile.id, props.otherProfile.name);
                } else {
                    doBlockUser(props.otherProfile.id, props.otherProfile.name);
                }
            }}
        >
            {isBlocked ? "🕊️" : "🚫"}
        </button>
    );
}

export default BlockButton;
