import React, {useEffect, useState} from "react";
import { authContentHeader } from "src/ApiCalls/headers";
import {UserProfileDTO} from "user-dto";

interface userRowEntry_prop {
  userId: number
}


function UserRowEntry(props: userRowEntry_prop): React.JSX.Element {
	const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/get_avatar/" + props.id;
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: authContentHeader(),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const blob = await response.blob();
      const imageUrl = URL.createObjectURL(blob);
      setAvatarURL(imageUrl);
	  console.log("working avatar url:", imageUrl);
    } catch (error) {
      console.log("Error getting Avatar", error);
    }
	
	
	
	return (
        <tr key = {props.userProfile.id}>
			<td><img src = {avatarURL} className="modal-avatar" alt="User Avatar" /></td>
            <td>{props.userProfile.name}</td>
            <td>{props.userProfile.rank}</td>
            <td>{props.userProfile.mmr}</td>
            <td>{props.userProfile.matches}</td>
            <td>{props.userProfile.winrate !== null ? props.userProfile.winrate : "N/A"}</td>
            <td>{props.userProfile.online ? 'online' : 'offline'}</td>
        </tr>
    )
}



export default UserRowEntry;
