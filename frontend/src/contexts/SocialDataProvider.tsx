import React, { createContext, useContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchWrapper } from "src/functions/utils";

// DTO
import { IdAndNameDTO, UserStatusDTO } from "src/dto/user-dto";
import { ToastContext } from "./ToastProvider";

export const SocialDataContext = createContext({
    friends: null as UserStatusDTO[],
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

export function SocialDataProvider({ children }) {
    const [friends, setFriends] = useState<UserStatusDTO[]>(null);
    const [friendReqOut, setFriendReqOut] = useState<IdAndNameDTO[]>(null);
    const [friendReqIn, setFriendReqIn] = useState<IdAndNameDTO[]>(null);
    const [blockedUsers, setBlockedUsers] = useState<IdAndNameDTO[]>(null);
	const {showToast} = useContext(ToastContext);
    
	// updaters

    async function updateFriends() {
        const friendsData = await fetchWrapper<UserStatusDTO[]>(
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
            showToast(response.message);
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
                showToast(response.message);
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
                showToast(response.message);
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
                showToast(response.message);
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
                showToast(response.message);
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
                showToast(response.message);
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
                showToast(response.message);
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
        <SocialDataContext.Provider value={contextValue}>
            {children}
        </SocialDataContext.Provider>
    );
}
