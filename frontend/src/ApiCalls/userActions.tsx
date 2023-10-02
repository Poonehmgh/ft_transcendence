import { authContentHeader, authHeader } from "./headers";

// This is the main function, the other functions prepare their bodies and API
// endpoints - but they are all the same pattern and can go through this central
// function.
async function userAction(body: string, apiUrl: string) {
  try {
    const response: Response = await fetch(apiUrl, {
      method: "POST",
      headers: authContentHeader(),
      body: body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error. Status: ${response.status}`);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function removeFriend(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/remove_friend";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function unblockUser(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/unblock";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function blockUser(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/block";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function cancelRequest(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/cancel_friendreq";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function acceptRequest(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/accept_friendreq";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function declineRequest(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/decline_friendreq";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function getAvatar_global(id: number) {
  const fetchUrl: string =
    process.env.REACT_APP_BACKEND_URL + `/uploads/get_avatar/${id}`;
  try {
    const response = await fetch(fetchUrl, {
      method: "GET",
      headers: authContentHeader(),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const blob = await response.blob();
    const imgElement = document.createElement("img");
    imgElement.src = URL.createObjectURL(blob);
    document.querySelector("#profile-picture-container").appendChild(imgElement);
  } catch (error) {
    console.log("Error getting Avatar", error);
  }
}
