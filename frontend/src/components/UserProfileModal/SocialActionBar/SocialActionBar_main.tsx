import React, { useContext, useEffect, useState } from "react";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";
import { fetchGetSet } from "src/functions/utils";
import backendUrl from "src/constants/backendUrl";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";

// DTO
import { UserRelation, UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/socialActionBar.css";

interface socialActionBarProps {
    otherProfile: UserProfileDTO;
}

function SocialActionBar(props: socialActionBarProps): React.JSX.Element {
    const socket = useContext(SocketContext);
    const [relation, setRelation] = useState<UserRelation>(null);

    useEffect(() => {
        if (!socket) return;

        socket.on("socialUpdate", () => {
            updateRelation();
        });

        return () => {
            socket.off("socialUpdate");
        };
    }, [socket]);

    async function updateRelation() {
        const apiUrl = backendUrl.user + "user_relation/" + props.otherProfile.id;
        const relation = await fetchGetSet<UserRelation>(apiUrl, setRelation);
    }

    useEffect(() => {
        updateRelation();
    }, []);

    return (
        <div className="socialActionBarMain">
            <FriendButton relation={relation} otherProfile={props.otherProfile} />
            <BlockButton relation={relation} otherProfile={props.otherProfile} />
        </div>
    );
}

export default SocialActionBar;
