import React from "react";
import { UserRelation } from "user-dto";
import { authContentHeader } from "./headers";

export async function fetchGet<T>(apiUrl: string): Promise<T> {
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

export async function fetchGetSet<T>(
    apiUrl: string,
    setter: React.Dispatch<React.SetStateAction<T | null>>
) {
    try {
        const data = await fetchGet<T>(apiUrl);
        setter(data);
    } catch (error) {
        console.log("Error fetchGetSet on ", apiUrl, ": ", error);
        setter(null);
    }
}

export async function fetch_UserRelation(
    thisId: number,
    otherId: number
): Promise<UserRelation> {
    const apiUrl =
        process.env.REACT_APP_BACKEND_URL +
        `/user/friendStatus?id1=${thisId}&id2=${otherId}`;
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
