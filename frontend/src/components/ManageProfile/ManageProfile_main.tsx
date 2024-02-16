import React, { useState, useEffect, useRef } from "react";
import ManageContactsTabs from "./ManageContactsTabs";
import PlayerCardTable from "../shared/PlayerCardTable";
import {
    fetchGetSet,
    authHeader,
    authContentHeader,
    sanitizeInput,
    fetchX,
} from "src/functions/utils";
import LoadingH2 from "src/components/shared/LoadingH2";
import TwoFa from "src/components/UserProfileModal/TwoFa";
// DTO
import { UserProfileDTO } from "src/dto/user-dto";

// CSS
import "src/styles/buttons.css";
import "src/styles/style.css";
import "src/styles/manageProfile.css";
import backendUrl from "src/constants/backendUrl";

function ManageProfile() {
    const [userData, setUserData] = useState<UserProfileDTO | null>(null);
    const [avatarURL, setAvatarURL] = useState(null);
    const fileInputRef = useRef(null);
    const apiUrl_profile = backendUrl.user + "my_profile";

    function handleChooseFileClick() {
        fileInputRef.current.click();
    }

    async function fetchAvatar() {
        const apiUrl = backendUrl.user + "my_avatar";
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: authContentHeader(),
            });
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);
            setAvatarURL(imageUrl);
        } catch (error) {
            console.log("Error getting Avatar", error);
        }
    }

    useEffect(() => {
        fetchGetSet(apiUrl_profile, setUserData);
        fetchAvatar();
    }, [apiUrl_profile]);

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);
        try {
            await fetch(backendUrl.user + "my_avatar", {
                method: "PUT",
                headers: authHeader(),
                body: formData,
            });
        } catch (error) {
            console.log(error);
        }
        fetchAvatar();
    }

    async function handleNameChange() {
        try {
            let newName = prompt("Enter a new name:");

            if (!newName) return;
            newName = newName.trim();
            if (newName === "" || newName === userData.name) return;

            const data = { newName: sanitizeInput(newName) };
            const apiUrl = backendUrl.user + "change_name";
            const res = await fetchX<{ message: string }>("PATCH", apiUrl, data);
            alert(res.message);
            fetchGetSet(apiUrl_profile, setUserData);
        } catch (error) {
            alert(error);
        }
    }

    async function handleLogout() {
        const apiUrl = backendUrl.user + "logout";
        const res = await fetchX<{ message: string }>("PATCH", apiUrl, null);
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;";
        alert(res.message);
        window.location.href = "/home";
    }

    if (!userData) return <LoadingH2 elementName={"Manage your profile"} />;

    return (
        <div className="mainContainerColumn" style={{ alignItems: "center" }}>
            <div className="h2">Manage your profile</div>
            <div className="manageProfile">
                <div className="leftAligner">
                    <div
                        className="h2Left"
                        style={{
                            flexDirection: "row",
                            justifyContent: "start",
                            alignItems: "flex-end",
                        }}
                    >
                        {userData.name}
                        <button className="editName" onClick={handleNameChange}>
                            ✎
                        </button>
                        <div style={{ width: "100%" }}></div>
                        <button className="logoutButton" onClick={handleLogout}>
                            <img src="images/logout.png" alt="Logout" height={"30px"} />
                        </button>
                    </div>
                </div>

                <div className="playerCard">
                    <img
                        src={avatarURL}
                        className="avatar"
                        alt="User Avatar"
                        onClick={handleChooseFileClick}
                    />
                    <div className="expanderHorizontal" />
                    <PlayerCardTable
                        mmr={userData.mmr}
                        rank={userData.rank}
                        matches={userData.matches}
                        winrate={userData.winrate}
                        twoFa={userData.twoFa}
                    />
                </div>
                <TwoFa/>
                <ManageContactsTabs />

                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                />
            </div>
        </div>
    );
}

export default ManageProfile;
