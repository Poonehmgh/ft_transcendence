import { IdAndNameDTO, UserRelation } from "user-dto";
import { authContentHeader } from "./headers";

export async function fetch_IdAndNameDTO(
  id: number,
  endPoint: string
): Promise<IdAndNameDTO[]> {
  const apiUrl = process.env.REACT_APP_BACKEND_URL + `/user/${endPoint}/${id}`;
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

export async function fetch_UserRelation(
    thisId: number,
    otherId: number): Promise<UserRelation> {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + `/user/friendStatus?id1=${thisId}&id2=${otherId}`;
    try {
    const response: Response = await fetch(apiUrl, {
        method: "GET",
        headers: authContentHeader(),
      });
      if (!response.ok) {
        console.log(apiUrl, ": ", response.status);
        return null;
      }
      const data: UserRelation = await response.json();
    return data;
    } catch (error) {
      console.log(error);
      return null;
}
    }
    
    export async function fetchAvatar_() {
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
          return imageUrl;
        } catch (error) {
          console.log("Error getting Avatar", error);
        }
      }