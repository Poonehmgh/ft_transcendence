import React, {useEffect, useState} from "react";
import SocialActionBar_a from './SocialActionBar_a';
import SocialActionBar_b from "./SocialActionBar_b";

interface SocialActionBar_prop {
  userId: number,
  otherId: number,
}

function SocialActionBar(props: SocialActionBar_prop): React.JSX.Element {
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const getStatus = async () => {
            try {
                const response = await fetch(`http://localhost:5500/user/friendStatus?id1=${props.userId}&id2=${props.otherId}`);

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
              <SocialActionBar_a relation={status}/>
          </div>
          <div>
              <SocialActionBar_b relation={status}/>
          </div>
        </div>
    )
}

export default SocialActionBar;
