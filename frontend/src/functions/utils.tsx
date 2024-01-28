import React from "react";

// getters

export function getCalendarDay(date: Date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

function getTokenFromCookie() {
    const cookies = document.cookie.split(";");
    let tokenValue = "";

    cookies.forEach((cookie) => {
        const [name, value] = cookie.trim().split("=");

        if (name === "token") {
            tokenValue = value;
        }
    });
    return tokenValue;
}

// headers

export function authHeader() {
    const myHeaders: Headers = new Headers();
    const token: string = "Bearer " + getTokenFromCookie();
    myHeaders.append("Authorization", token);
    return myHeaders;
}

export function authContentHeader() {
    const myHeaders: Headers = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const token: string = "Bearer " + getTokenFromCookie();
    myHeaders.append("Authorization", token);

    return myHeaders;
}

// fetchers

export async function fetchGet<T>(apiUrl: string): Promise<T> {
    try {
        const response: Response = await fetch(apiUrl, {
            method: "GET",
            headers: authContentHeader(),
        });
        if (!response.ok) {
            console.log(apiUrl, ": ", response.status);
            console.log("not response ok in fetchget");
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
        setter(null);
    }
}
