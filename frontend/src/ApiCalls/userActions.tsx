import { authContentHeader, authHeader } from "./headers";

export async function removeFriend(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/remove_friend";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

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

export async function declineRequest(thisId: number, otherId: number) {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/decline_friendreq";
  const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });

  return userAction(body, apiUrl);
}

export async function acceptRequest(thisId: number, otherId: number) {
	const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/accept_friendreq";
	const body: string = JSON.stringify({ thisId: thisId, otherId: otherId });
  
	return userAction(body, apiUrl);
  }

export async function userAction(body: string, apiUrl: string) {
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

export function userAction_(otherId: number, endpoint: string): void {
  const body: string = JSON.stringify({ otherId: otherId });
  void fetchPost(endpoint, authContentHeader, body);
}

const fetchPost = async (url: string, header: any, body: string): Promise<any> => {
  const fetchUrl: string = process.env.REACT_APP_BACKEND_URL + "/user/" + url;
  try {
    const response: Response = await fetch(fetchUrl, {
      method: "POST",
      headers: header, // maybe dont need to pass this in
      body: body,
    });
    const result = await response.json();
    if (!response.ok) {
      console.log("fetchPost: status:", response.status, " on '", url, "'");
      return { error: `Error ${response.status} on '${url}'` };
    }
    return result;
  } catch (error) {
    console.error("fetchPost: catch: ", error, " on '", url, "'");
    return { error: "fetchPost: catch" };
  }
};

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
