import React, { createContext, useEffect, useState } from "react";
import backendUrl from "src/constants/backendUrl";
import { fetchX } from "src/functions/utils";

// DTO
import { IdAndNameDTO } from "user-dto";

export const UserDataContext = createContext({
    friends: null as IdAndNameDTO[],
    friendReqOut: null as IdAndNameDTO[],
    friendReqIn: null as IdAndNameDTO[],
    blockedUsers: null as IdAndNameDTO[],
    updateUserData: () => {},
});

export function UserDataProvider({ children }) {
    const [friends, setFriends] = useState<IdAndNameDTO[]>(null);
    const [friendReqOut, setFriendReqOut] = useState<IdAndNameDTO[]>(null);
    const [friendReqIn, setFriendReqIn] = useState<IdAndNameDTO[]>(null);
    const [blockedUsers, setBlockedUsers] = useState<IdAndNameDTO[]>(null);

    async function updateUserData() {
        const friendsData = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "friends",
            null
        );
        setFriends(friendsData);

        const friendReqOut = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "request_out",
            null
        );
        setFriendReqOut(friendReqOut);

        const friendReqIn = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "request_in",
            null
        );
        setFriendReqIn(friendReqIn);

        const blocked = await fetchX<IdAndNameDTO[]>(
            "GET",
            backendUrl.user + "blocked",
            null
        );
        setBlockedUsers(blocked);
    }

    useEffect(() => {
        updateUserData();
    }, []);


    






    const contextValue = {
        friends: friends,
        friendReqOut: friendReqOut,
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
