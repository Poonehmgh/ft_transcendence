import { authContentHeader } from "./headers";

export function userAction(otherId: number, endpoint: string): void {
  const body: string = JSON.stringify( { otherId: otherId });
  void fetchPost(endpoint, authContentHeader, body);
}

const fetchPost = async (url: string, header: any, body: string): Promise<any> => {
  const fetchUrl: string = process.env.REACT_APP_BACKEND_URL + "/user/" + url;
  try {
    const response: Response = await fetch(fetchUrl, {
      method: "POST",
      headers: header,
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
