import { authContentHeader } from "./headers";

/*
This is the main function that connects to the backend.
The other functions just prepare the vars.
*/
async function userAction(body: string, apiUrl: string) {
    try {
        const response: Response = await fetch(apiUrl, {
            method: "POST",
            headers: authContentHeader(),
            body: body,
        });
        if (!response.ok) {
            throw new Error(`HTTP error. Status: ${response.status}`);
        }
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}

export async function addFriend(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/send_friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}

export async function removeFriend(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/remove_friend";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}

export async function unblockUser(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/unblock";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}

export async function blockUser(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/block";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}

export async function cancelRequest(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/cancel_friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}

export async function acceptRequest(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/accept_friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}

export async function declineRequest(otherId: number) {
    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/decline_friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(body, apiUrl);
}
