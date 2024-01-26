import React from "react";
import { handleBlockUser, handleUnBlockUser } from "src/functions/userActions";

// DTO
import { UserProfileDTO, UserRelation } from "../shared/DTO";

interface blockButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    console.log("BlockButton - otherProfile:", props.otherProfile);
console.log("BlockButton - status:", props.relation);

	function doBlockUser(id: number, name: string) {
		handleBlockUser(id, name);
	}

	function doUnblockUser(id: number, name: string) {
		handleUnBlockUser(id, name);
	}
	
	switch (props.relation) {
        case UserRelation.blocked:
            return (
                <button onClick={() => doUnblockUser(props.otherProfile.id, props.otherProfile.name)}>
                    Unblock user
                </button>
            );

        default:
            return (
                <button onClick={() => doBlockUser(props.otherProfile.id, props.otherProfile.name)}>
                    Block user
                </button>

            );
    }
}

export default BlockButton;
