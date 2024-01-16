import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { fetch_getSet } from "src/ApiCalls/fetchers";

interface channels_prop {
  id: number;
}

function Channels(props: channels_prop): React.JSX.Element {
  const [channels, setChannels] = useState([]);
  const socket = io(process.env.REACT_APP_BACKEND_URL);

  useEffect(() => {
    // get user's chats
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/" + props.id;
    fetch_getSet(apiUrl, setChannels);
    console.log("channels fetchgetset: ", channels);

    // api: backend/chat/:userId
    // return: ChatListDTO:
    //	chatName: string;
    //	chatID: number;
  }, []);

  function joinChannel(channel) {
    socket.emit("joinChannel", channel);
    // update chats etc
  }

  return (
    <div>
      <h2>Available Channels:</h2>
      <ul>
        {channels.map((channel) => (
          <li key={channel} onClick={() => joinChannel(channel)}>
            {channel}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Channels;
