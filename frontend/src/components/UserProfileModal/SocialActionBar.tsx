import React, { useEffect, useState } from "react";
import FriendButton from "./FriendButton";
import BlockButton from "./BlockButton";
import { fetchGetSet } from "src/functions/fetchers";

// DTO
import { UserRelation } from "../shared/DTO";

interface socialActionBarProps {
  otherId: number;
}

function SocialActionBar(props: socialActionBarProps): React.JSX.Element {
  const [status, setStatus] = useState<UserRelation>(null);
  const apiUrl =
  process.env.REACT_APP_BACKEND_URL + "/user/user_relation/" + props.otherId;

  useEffect(() => {
	fetchGetSet(apiUrl, setStatus);
  }, [apiUrl]);

  return (
    <div>
      <div>
        <FriendButton relation={status} otherId={props.otherId} />
      </div>
      <div>
        <BlockButton relation={status} otherId={props.otherId} />
      </div>
    </div>
  );
}


export default SocialActionBar;
