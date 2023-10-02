import { IdAndNameDTO } from "user-dto";
import { authContentHeader, authHeader } from "./headers";

export async function fetchFriends(id: number): Promise<IdAndNameDTO[]> {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/friends/" + id;
  try {
    const response: Response = await fetch(apiUrl, {
      method: "GET",
      headers: authContentHeader(),
    });
    if (!response.ok) {
      console.log(apiUrl, ": ", response.status);
      return null;
    }
	const data: IdAndNameDTO[] = await response.json();
	return data;
  } catch (error) {
    console.log(error);
    return null;
  }
}
