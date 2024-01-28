import React, { useEffect, useState } from "react";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";
import { fetchGetSet } from "src/functions/fetchers";

// DTO
import { UserRelation, UserProfileDTO } from "../shared/DTO";

// CSS
import "src/styles/socialActionBar.css"

interface socialActionBarProps {
  otherProfile: UserProfileDTO;
}

function SocialActionBar(props: socialActionBarProps): React.JSX.Element {
  const [status, setStatus] = useState<UserRelation>(null);
  const apiUrl =
  process.env.REACT_APP_BACKEND_URL + "/user/user_relation/" + props.otherProfile.id;

  useEffect(() => {
	fetchGetSet(apiUrl, setStatus);
  }, [apiUrl]);

  console.log("SocialActionBar - otherProfile:", props.otherProfile);
  console.log("SocialActionBar - status:", status);

  return (
    <div className="socialActionBarMain">
        <FriendButton relation={status} otherProfile={props.otherProfile} />
        <BlockButton relation={status} otherProfile={props.otherProfile} />
    </div>
  );
}

export default SocialActionBar;
