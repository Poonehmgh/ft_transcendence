import React, { createContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "src/functions/utils";

// DTO
import { IdAndNameDTO } from "user-dto";

export const UserDataContext = createContext({
    friends: null as IdAndNameDTO[],
    friendReqOut: null as IdAndNameDTO[],
    friendReqIn: null as IdAndNameDTO[],
    blockedUsers: null as IdAndNameDTO[],
    sendFriendRequest: (otherId: number, otherName: string) => {},
    cancelFriendRequest: (otherId: number, otherName: string) => {},
    removeFriend: (otherId: number, otherName: string) => {},
    blockUser: (otherId: number, otherName: string) => {},
    unblockUser: (otherId: number, otherName: string) => {},
    acceptRequest: (otherId: number, otherName: string) => {},
    declineRequest: (otherId: number, otherName: string) => {},
    updateUserData: () => {},
});

export function UserDataProvider({ children }) {
    const [friends, setFriends] = useState<IdAndNameDTO[]>(null);
    const [friendReqOut, setFriendReqOut] = useState<IdAndNameDTO[]>(null);
    const [friendReqIn, setFriendReqIn] = useState<IdAndNameDTO[]>(null);
    const [blockedUsers, setBlockedUsers] = useState<IdAndNameDTO[]>(null);

    // updaters

    async function updateFriends() {
        const friendsData = await fetchWrapper<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "friends",
            null
        );
        setFriends(friendsData);
    }

    async function updateFriendReqOut() {
        const friendReqOut = await fetchWrapper<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "request_out",
            null
        );
        setFriendReqOut(friendReqOut);
    }

    async function updateFriendReqIn() {
        const friendReqIn = await fetchWrapper<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "request_in",
            null
        );
        setFriendReqIn(friendReqIn);
    }

    async function updateBlockedUsers() {
        const blocked = await fetchWrapper<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "blocked",
            null
        );
        setBlockedUsers(blocked);
    }

    function updateUserData() {
        console.log("updateUserData");
        updateFriends();
        updateFriendReqOut();
        updateFriendReqIn();
        updateBlockedUsers();
    }

    useEffect(() => {
        updateUserData();
        // eslint-disable-next-line
    }, []);

    // user actions

    async function sendFriendRequest(otherId: number, otherName: string) {
        if (!window.confirm("Send friend request to user " + otherName + "?")) return;
        const method = "POST";
        const apiUrl = backendUrl.user + "friendreq";
        const body = { otherId: otherId };
        const response = await fetchWrapper<{ message: string }>(method, apiUrl, body);
        if (response) {
            updateFriendReqOut();
            alert(response.message);
        }
    }

    async function cancelFriendRequest(otherId: number, otherName: string) {
        if (window.confirm("Cancel friend request to user " + otherName + "?")) {
            const method = "DELETE";
            const apiUrl = backendUrl.user + "friendreq";
            const body = { otherId: otherId };
            const response = await fetchWrapper<{ message: string }>(
                method,
                apiUrl,
                body
            );
            if (response) {
                updateFriendReqOut();
                alert(response.message);
            }
        }
    }

    async function removeFriend(otherId: number, otherName: string) {
        if (window.confirm("Remove friend " + otherName + "?")) {
            const method = "DELETE";
            const apiUrl = backendUrl.user + "friend";
            const body = { otherId: otherId };
            const response = await fetchWrapper<{ message: string }>(
                method,
                apiUrl,
                body
            );
            if (response) {
                updateFriends();
                alert(response.message);
            }
        }
    }

    async function blockUser(otherId: number, otherName: string) {
        if (window.confirm("Block user " + otherName + "?")) {
            const method = "POST";
            const apiUrl = backendUrl.user + "block";
            const body = { otherId: otherId };
            const response = await fetchWrapper<{ message: string }>(
                method,
                apiUrl,
                body
            );
            if (response) {
                updateBlockedUsers();
                alert(response.message);
            }
        }
    }

    async function unblockUser(otherId: number, otherName: string) {
        if (window.confirm("Unblock user " + otherName + "?")) {
            const method = "DELETE";
            const apiUrl = backendUrl.user + "block";
            const body = { otherId: otherId };
            const response = await fetchWrapper<{ message: string }>(
                method,
                apiUrl,
                body
            );
            if (response) {
                updateBlockedUsers();
                alert(response.message);
            }
        }
    }

    async function acceptRequest(otherId: number, otherName: string) {
        if (window.confirm("Accept friend request from user " + otherName + "?")) {
            const method = "PATCH";
            const apiUrl = backendUrl.user + "friendreq";
            const body = { otherId: otherId, action: "accept" };
            const response = await fetchWrapper<{ message: string }>(
                method,
                apiUrl,
                body
            );
            if (response) {
                updateFriendReqIn();
                updateFriends();
                alert(response.message);
            }
        }
    }

    async function declineRequest(otherId: number, otherName: string) {
        if (window.confirm("Decline friend request from user " + otherName + "?")) {
            const method = "PATCH";
            const apiUrl = backendUrl.user + "friendreq";
            const body = { otherId: otherId, action: "decline" };
            const response = await fetchWrapper<{ message: string }>(
                method,
                apiUrl,
                body
            );
            if (response) {
                updateFriendReqIn();
                alert(response.message);
            }
        }
    }

    const contextValue = {
        friends: friends,
        friendReqOut: friendReqOut,
        friendReqIn: friendReqIn,
        blockedUsers: blockedUsers,
        sendFriendRequest: sendFriendRequest,
        cancelFriendRequest: cancelFriendRequest,
        removeFriend: removeFriend,
        blockUser: blockUser,
        unblockUser: unblockUser,
        acceptRequest: acceptRequest,
        declineRequest: declineRequest,
        updateUserData: updateUserData,
    };

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
}
