import React from "react";

// getters

export function getCalendarDay(date: Date) {
    if (!date) return "invalid date";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function getTokenFromCookie() {
    const cookies = document.cookie.split(";");
    let tokenValue = null;

    cookies.forEach((cookie) => {
        const [name, value] = cookie.trim().split("=");

        if (name === "token") {
            tokenValue = value;
        }
    });
    return tokenValue;
}

// checkers

export function isTokenValid(token: string) {
    try {
        if (!token) {
            console.error("No token in cookies.");
            return false;
        }

        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const expirationTime = decodedToken.exp * 1000;

        localStorage.setItem("userId", decodedToken.id);

        return expirationTime > Date.now();
    } catch (error) {
        console.error("Error decoding or validating token:", error);
        return false;
    }
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

export async function fetchX<T>(
    method: string,
    apiUrl: string,
    data: Record<string, any> | null
): Promise<T | null> {
    try {
        const response: Response = await fetch(apiUrl, {
            method: method,
            headers: authContentHeader(),
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            console.error(`${apiUrl}: ${response.status}`);
            throw new Error(`Not OK response in fetchX`);
        }
        console.log("fetchX returning");
        return await response.json();
    } catch (error) {
        console.error(error);
        throw new Error("Error in fetchX");
    }
}

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
