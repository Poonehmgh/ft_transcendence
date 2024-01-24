export function authHeader() {

    //const token: string = "Bearer " + Cookies.get("token");

    const token: string = "bearer " + localStorage.getItem("userToken");
    const myHeaders: Headers = new Headers();
    myHeaders.append("Authorization", token);
    return myHeaders;
}

export function authContentHeader() {
    const myHeaders: Headers = new Headers();
    const token = "Bearer " + "dd609527e582835b60cfcbc3a56b9df961ce5f94e0181315ae8c4fc7677b1a0d";
    
    
    const token2: string = "Bearer " + localStorage.getItem("userToken");
    myHeaders.append("Authorization", token2);
    //myHeaders.append("Content-Type", "application/json");
    return myHeaders;
}
