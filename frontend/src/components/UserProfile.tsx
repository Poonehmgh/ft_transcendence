import React, {useEffect, useState} from "react";
import {UserProfileDTO} from "../../../backend/src/user/user-dto";

interface userProfileProp {
  userId: number,
  sizeFactor: number
}

function UserProfile(props: userProfileProp): Element {
  const [userProfile, setUserProfile] = useState <UserProfileDTO>();
  useEffect(() => {
  
  }, [props.userId, props.sizeFactor]);
  return (
      <div>
      
      </div>
  );
}
