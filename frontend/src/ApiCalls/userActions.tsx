import { authContentHeader, authHeader } from "./headers";

export function userAction(otherId: number, endpoint: string): void {
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
      redirect: "follow",
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

export async function getAvatar(id: number) {
  const fetchUrl: string = process.env.REACT_APP_BACKEND_URL + `/uploads/get_avatar/${id}`;
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
    console.log("Error getting Avatar");
  }
}
