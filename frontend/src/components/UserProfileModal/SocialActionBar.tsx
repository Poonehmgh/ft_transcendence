import React, { useEffect, useState } from "react";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";
import { fetchGetSet } from "src/functions/fetchers";

// DTO
import { UserRelation, UserProfileDTO } from "../shared/DTO";

// CSS
import "src/styles/socialActionBar.css";

interface socialActionBarProps {
    otherProfile: UserProfileDTO;
}

function SocialActionBar(props: socialActionBarProps): React.JSX.Element {
    const [relation, setRelation] = useState<UserRelation>(null);
    const [forceRerender, setForceRerender] = useState(false);
    const apiUrl =
        process.env.REACT_APP_BACKEND_URL +
        "/user/user_relation/" +
        props.otherProfile.id;

    function reRender() {
        setForceRerender((prevState) => !prevState);
    }

    useEffect(() => {
        fetchGetSet(apiUrl, setRelation);
    }, [apiUrl, forceRerender]);

    return (
        <div className="socialActionBarMain">
            <FriendButton
                relation={relation}
                otherProfile={props.otherProfile}
                reRender={reRender}
            />
            <BlockButton
                relation={relation}
                otherProfile={props.otherProfile}
                reRender={reRender}
            />
        </div>
    );
}

export default SocialActionBar;

//setSelectedChat: React.Dispatch<React.SetStateAction<ChatListDTO | null>>;
