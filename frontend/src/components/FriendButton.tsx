import React, {useEffect, useState} from "react";
import {UserProfileDTO} from "../../../backend/src/user/user-dto";

interface friendButtonProp {
    userId: number,
    friendId: number
}

function FriendButton(props: friendButtonProp): React.JSX.Element {
  const [buttonText, setButtonText] = useState <String>();

  useEffect(() => {
    void fetchAndSet(props, setButtonText);
  }, [props.userId]);

  return (
      // if noFriendInteractions
      //    add friend
      // else
      //    if friends:
      //        remove friend
      //    else if: friendrequest sent to other user
      //        cancel friendreq
      //    else if: frienrequest sent from other user
      //        accept friendrequest
      <div>

      </div>
  );
}

const fetchAndSet = async (props: friendButtonProp, setter: React.Dispatch<React.SetStateAction<String>>): Promise<void> => {
  try {
    const response = await fetch(`http://localhost:5500/user/profile?id=${userId}`);
    const data = await response.json();
    setter(data);
  } catch (error) {
    console.error('Error fetching user/profile:', error);
    setter(null);
  }
}

export default UserProfile;
