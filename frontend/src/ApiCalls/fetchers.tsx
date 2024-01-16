import React from "react";
import { IdAndNameDTO, UserRelation } from "user-dto";
import { authContentHeader } from "./headers";

export async function fetch_getSet(
  apiUrl: string,
  setter: React.Dispatch<React.SetStateAction<ScoreCardDTO[]>>
): Promise<void> {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: authContentHeader(),
    });
    const data = await response.json();
    setter(data);
  } catch (error) {
    console.error("Error fetch_getSet", error);
    setter(null);
  }
}

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

export async function fetch_get_JSON(apiUrl: string): Promise<JSON | null> {
  try {
    const response: Response = await fetch(apiUrl, {
      method: "GET",
      headers: authContentHeader(),
    });
    if (!response.ok) {
      console.log(apiUrl, ": ", response.status);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function fetch_UserRelation(
  thisId: number,
  otherId: number
): Promise<UserRelation> {
  const apiUrl =
    process.env.REACT_APP_BACKEND_URL + `/user/friendStatus?id1=${thisId}&id2=${otherId}`;
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
