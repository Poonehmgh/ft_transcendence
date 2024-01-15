import React, {useEffect, useState} from "react";
import FriendButton from './FriendButton';
import BlockButton from "./BlockButton";

interface SocialActionBar_prop {
  userId: number,
  otherId: number,
}

function SocialActionBar(props: SocialActionBar_prop): React.JSX.Element {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const getStatus = async () => {
		const apiUrl = process.env.REACT_APP_BACKEND_URL + `user/friendStatus?id1=${props.userId}&id2=${props.otherId}`;
            
			try {
                //const response = await fetch(`http://localhost:5500/user/friendStatus?id1=${props.userId}&id2=${props.otherId}`);
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    setStatus(null);
                } else {
                    const data = await response.json();
                    setStatus(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setStatus(null);
            }
        };

		
        void getStatus();
    }, [props.userId, props.otherId, status]);

    return (
        <div>
          <div>
              <FriendButton relation={status} thisId = {props.userId} otherId = {props.otherId} />
          </div>
          <div>
              <BlockButton relation={status} thisId = {props.userId} otherId = {props.otherId}/>
          </div>
        </div>
    )
}

export default SocialActionBar;
