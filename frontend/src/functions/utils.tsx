import React from "react";

// getters

export function getCalendarDay(date: Date) {
    if (!date) return "invalid date";
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
}

export function getDecodedTokenFromCookie() {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");

        if (name === "token") {
            const decodedToken = JSON.parse(atob(value.split(".")[1]));
            return decodedToken;
        }
    }
    return null;
}

export function getPureTokenFromCookie() {
    const cookies = document.cookie.split(";");

    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split("=");

        if (name === "token") {
            return value;
        }
    }
    return null;
}

// checkers

export function gotValidToken() {
    try {
        const token = getDecodedTokenFromCookie();
        if (!token) {
            console.error("No token in cookies.");
            return false;
        }
        const expirationTime = token.exp * 1000;
        return expirationTime > Date.now();
    } catch (error) {
        console.error("Error decoding or validating token:", error);
        return false;
    }
}

// headers

export function authHeader() {
    const myHeaders: Headers = new Headers();
    const token: string = "Bearer " + getPureTokenFromCookie();
    myHeaders.append("Authorization", token);
    return myHeaders;
}

export function authContentHeader() {
    const myHeaders: Headers = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const token: string = "Bearer " + getPureTokenFromCookie();
    myHeaders.append("Authorization", token);

    return myHeaders;
}

// fetchers

export async function fetchWrapper<T>(
    method: string,
    apiUrl: string,
    data: Record<string, any> | null
): Promise<T | any> {
    try {
        const response: Response = await fetch(apiUrl, {
            method: method,
            headers: authContentHeader(),
            body: data ? JSON.stringify(data) : null,
        });

        if (!response.ok) {
            console.error(`${apiUrl}: ${response.status}`);
            if (response.status === 401) {
                window.location.href = "/home";
            }
            const errorMessage = { message: `Error ${response.status}: ${response.statusText}` };
            return errorMessage;
        }

        return await response.json();
    } catch (error) {
        console.error("Error in fetchX:", error);
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

// sanitizers

export function sanitizeInput(input: string) {
    return input.replace(/[^a-zA-Z0-9_ ]/g, "");
}
