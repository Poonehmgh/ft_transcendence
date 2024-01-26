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
