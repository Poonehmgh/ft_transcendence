import React, { useContext } from "react";

// Contexts
import { UserDataContext } from "src/contexts/UserDataProvider";

// DTO
import { UserProfileDTO, UserRelation } from "src/dto/user-dto";

interface blockButtonProps {
    relation: UserRelation;
    otherProfile: UserProfileDTO;
}

function BlockButton(props: blockButtonProps): React.JSX.Element {
    const { blockUser, unblockUser } = useContext(UserDataContext);

    return (
        <div>
            <button
                className="userActionButton"
                data-tooltip={
                    props.relation === UserRelation.blocked ? "Unblock" : "Block"
                }
                onClick={() => {
                    props.relation === UserRelation.blocked
                        ? unblockUser(props.otherProfile.id, props.otherProfile.name)
                        : blockUser(props.otherProfile.id, props.otherProfile.name);
                }}
            >
                {props.relation === UserRelation.blocked ? "🕊️" : "🚫"}
            </button>
        </div>
    );
}

export default BlockButton;
