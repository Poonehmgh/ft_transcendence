import React, { useContext, useEffect, useState } from "react";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";

// Contexts
import { UserDataContext } from "src/contexts/UserDataProvider";

// DTO
import { UserRelation, UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/socialActionBar.css";

interface socialActionBarProps {
    otherProfile: UserProfileDTO;
}

function SocialActionBar(props: socialActionBarProps): React.JSX.Element {
    const { friends, friendReqOut, friendReqIn, blockedUsers } =
        useContext(UserDataContext);
    const [relation, setRelation] = useState<UserRelation>(null);

    useEffect(() => {
        function updateRelation() {
            let newRelation = UserRelation.none;
            const otherId = props.otherProfile.id;

            if (blockedUsers.some((e) => e.id === otherId)) {
                newRelation = UserRelation.blocked;
            } else if (friends.some((e) => e.id === otherId)) {
                newRelation = UserRelation.friends;
            } else if (friendReqIn.some((e) => e.id === otherId)) {
                newRelation = UserRelation.request_received;
            } else if (friendReqOut.some((e) => e.id === otherId)) {
                newRelation = UserRelation.request_sent;
            }
            setRelation(newRelation);
        }

        updateRelation();
    }, [friends, friendReqOut, friendReqIn, blockedUsers]);

    return (
        <div className="socialActionBarMain">
            <FriendButton relation={relation} otherProfile={props.otherProfile} />
            <BlockButton relation={relation} otherProfile={props.otherProfile} />
        </div>
    );
}

export default SocialActionBar;
