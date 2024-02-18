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

    function updateRelation() {
        console.log("updateRelation: firends: ", friends);
        let newRelation = UserRelation.none;
        const otherId = props.otherProfile.id;

        if (friends.some((item) => item.id === otherId)) {
            newRelation = UserRelation.friends;
        } else if (friendReqOut.some((item) => item.id === otherId)) {
            newRelation = UserRelation.request_sent;
        } else if (friendReqIn.some((item) => item.id === otherId)) {
            newRelation = UserRelation.request_received;
        } else if (blockedUsers.some((item) => item.id === otherId)) {
            newRelation = UserRelation.blocked;
        }
        setRelation(newRelation);
    }

    useEffect(() => {
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
