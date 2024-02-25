// getters

export function getCalendarDay(date: Date) {
    if (!date) return "invalid date";

    const dateObj = new Date(date); // to handle if date is a string

    if (isNaN(dateObj.getTime())) {
        return "invalid date";
    }

    const day = dateObj.getDate().toString().padStart(2, "0");
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const year = dateObj.getFullYear();

    return `${day}.${month}.${year}`;
}

export function getDecodedTokenFromCookie() {
    const token = getPureTokenFromCookie();

    if (!token) return null;

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    return decodedToken;
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
            if (response.status === 401) {
                console.error("401 Unauthorized in fetchWrapper:", apiUrl);
                const excludedPaths = ["/home", "/auth", "/message"];
                if (!excludedPaths.includes(window.location.pathname)) {
                    window.location.href = "/home";
                }
            } else if (response.status === 403) {
                console.error("403 Forbidden in fetchWrapper:", apiUrl);
            } else {
                console.error(
                    `Response not ok in fetchWrapper: ${apiUrl}: ${response.status}`
                );
            }
        }

        return await response.json();
    } catch (error) {
        console.error("Error in fetchWrapper:", error);
    }
}

// sanitizers

export function sanitizeInput(input: string) {
    return input.replace(/[^a-zA-Z0-9_ ]/g, "");
}
