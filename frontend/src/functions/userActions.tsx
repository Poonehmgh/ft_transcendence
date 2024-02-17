import backendUrl from "src/constants/backendUrl";
import { authContentHeader } from "./utils";

// to do: pass the strings and 2nd lvl functions into a central handler function.

/*
This is the main function that connects to the backend.
The other functions just prepare the vars.
*/
async function userAction(method: string, apiUrl: string, body: string) {

    try {
        const response: Response = await fetch(apiUrl, {
            method: method,
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

// Send friend request

export async function handleSendFriendRequest(otherId: number, otherName: string) {
    if (window.confirm("Send friend request to user " + otherName + "?")) {
        if (sendFriendRequest(otherId)) {
            alert("Friend request sent");
        } else {
            alert("Error sending friend request");
        }
    }
}

async function sendFriendRequest(otherId: number) {
    const method = "POST";
    const apiUrl = backendUrl.user + "friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}

// Cancel friend request

export async function handleCancelRequest(otherId: number, otherName: string) {
    if (window.confirm("Cancel friend request to user " + otherName + "?")) {
        if (cancelRequest(otherId)) {
            alert("Friend request canceled");
        } else {
            alert("Error canceling friend request");
        }
    }
}

async function cancelRequest(otherId: number) {
    const method = "DELETE";
    const apiUrl = backendUrl.user + "friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}

// Remove friend

export async function handleRemoveFriend(otherId: number, otherName: string) {
    if (window.confirm("Remove friend " + otherName + "?")) {
        if (removeFriend(otherId)) {
            alert("Friend removed");
        } else {
            alert("Error removing friend");
        }
    }
}

async function removeFriend(otherId: number) {
    const method = "DELETE";
    const apiUrl = backendUrl.user + "friend";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}

// Unblock user

export async function handleUnBlockUser(otherId: number, otherName: string) {
    if (window.confirm("Unblock user " + otherName + "?")) {
        if (unblockUser(otherId)) {
            alert("User unblocked");
        } else {
            alert("Error unblocking user");
        }
    }
}

async function unblockUser(otherId: number) {
    const method = "DELETE";
    const apiUrl = backendUrl.user + "block";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}

// Block user

export async function handleBlockUser(otherId: number, otherName: string) {
    if (window.confirm("Block user " + otherName + "?")) {
        if (blockUser(otherId)) {
            alert("User blocked");
        } else {
            alert("Error blocking user");
        }
    }
}

async function blockUser(otherId: number) {
    const method = "POST";
    const apiUrl = backendUrl.user + "block";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}

// Accept / Decline Request Dispatch
// to do: defuglify this prompt

export async function handleIncomingRequest(otherId: number, otherName: string) {
    const userInput = prompt(
        "Select an option:\n\n1. Accept\n2. Decline\n3. Ignore for now"
    );

    switch (userInput) {
        case "1":
            handleAcceptRequest(otherId, otherName);
            break;
        case "2":
            handleDeclineRequest(otherId, otherName);
            break;
        case "3":
            break;
        default:
            console.log("Invalid option selected");
    }
}

// Accept Request

export async function handleAcceptRequest(otherId: number, otherName: string) {
    if (window.confirm("Accept friend request from user " + otherName + "?")) {
        if (acceptRequest(otherId)) {
            alert("Friend request accepted");
        } else {
            alert("Error accepting friend request");
        }
    }
}

async function acceptRequest(otherId: number) {
    const method = "PATCH";
    const apiUrl = backendUrl.user + "accept_friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}

// Decline Request

export async function handleDeclineRequest(otherId: number, otherName: string) {
    if (window.confirm("Decline friend request from user " + otherName + "?")) {
        if (declineRequest(otherId)) {
            alert("Friend request declined");
        } else {
            alert("Error declining friend request");
        }
    }
}

async function declineRequest(otherId: number) {
    const method = "PATCH";
    const apiUrl = backendUrl.user + "decline_friendreq";
    const body: string = JSON.stringify({ otherId: otherId });

    return userAction(method, apiUrl, body);
}
