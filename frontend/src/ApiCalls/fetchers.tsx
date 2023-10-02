import { IdAndNameDTO } from "user-dto";
import { authContentHeader, authHeader } from "./headers";

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
