export function authHeader() {
  const token: string = "Bearer " + localStorage.getItem("userToken");
  const myHeaders: Headers = new Headers();
  myHeaders.append("Authorization", token);
  return myHeaders;
}

export function authContentHeader() {
  const token: string = "bearer " + localStorage.getItem("userToken");
  const myHeaders: Headers = new Headers();
  myHeaders.append("Authorization", token);
  myHeaders.append("Content-Type", "application/json");
  return myHeaders;
}
