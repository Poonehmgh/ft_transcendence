import React, { createContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchX } from "src/functions/utils";

// DTO
import { IdAndNameDTO } from "user-dto";

export const UserDataContext = createContext({
    friends: null as IdAndNameDTO[],
    friendReqOut: null as IdAndNameDTO[],
    sendFriendRequest: (otherId: number, otherName: string) => {},
    friendReqIn: null as IdAndNameDTO[],
    blockedUsers: null as IdAndNameDTO[],
    updateUserData: () => {},
});

export function UserDataProvider({ children }) {
    const [friends, setFriends] = useState<IdAndNameDTO[]>(null);
    const [friendReqOut, setFriendReqOut] = useState<IdAndNameDTO[]>(null);
    const [friendReqIn, setFriendReqIn] = useState<IdAndNameDTO[]>(null);
    const [blockedUsers, setBlockedUsers] = useState<IdAndNameDTO[]>(null);

    async function updateFriends() {
        const friendsData = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "friends",
            null
        );
        setFriends(friendsData);
    }

    async function updateFriendReqOut() {
        const friendReqOut = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "request_out",
            null
        );
        setFriendReqOut(friendReqOut);
    }

    async function updateFriendReqIn() {
        const friendReqIn = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "request_in",
            null
        );
        setFriendReqIn(friendReqIn);
    }

    async function updateBlockedUsers() {
        const blocked = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "blocked",
            null
        );
        setBlockedUsers(blocked);
    }

    async function updateUserData() {
        updateFriends();
        updateFriendReqOut();
        updateFriendReqIn();
        updateBlockedUsers();
    }

    useEffect(() => {
        updateUserData();
    }, []);

    async function sendFriendRequest(otherId: number, otherName: string) {
        if (!window.confirm("Send friend request to user " + otherName + "?")) return;
        const method = "POST";
        const apiUrl = backendUrl.user + "friendreq";
        const body = { otherId: otherId };
        const response = await fetchX<{ message: string }>(method, apiUrl, body);
        if (response) {
            updateFriendReqOut();
            alert(response.message);
        }
    }

    const contextValue = {
        friends: friends,
        friendReqOut: friendReqOut,
        sendFriendRequest: sendFriendRequest,
        friendReqIn: friendReqIn,
        blockedUsers: blockedUsers,
        updateUserData: updateUserData,
    };

    return (
        <UserDataContext.Provider value={contextValue}>
            {children}
        </UserDataContext.Provider>
    );
}
