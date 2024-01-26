import React, { useState, useEffect, useRef } from "react";
import { authContentHeader } from "src/functions/headers";
import ManageContactsTabs from "./ManageContactsTabs";
import PlayerCardTable from "../shared/PlayerCardTable";
import { fetchGetSet } from "src/functions/fetchers";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/buttons.css";
import "src/styles/style.css";
import "src/styles/manageProfile.css";
import { authHeader } from "../../functions/headers";

function ManageProfile() {
    const [userData, setUserData] = useState<UserProfileDTO | null>(null);
    const [avatarURL, setAvatarURL] = useState(null);
    const fileInputRef = useRef(null);
    const apiUrl_profile = process.env.REACT_APP_BACKEND_URL + "/user/my_profile";

    function handleChooseFileClick() {
        fileInputRef.current.click();
    }

    async function fetchAvatar() {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/my_avatar";
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
            await fetch(process.env.REACT_APP_BACKEND_URL + "/user/put_avatar", {
                method: "POST",
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

            if (newName === null)
                return;
            newName = newName.trim();
            if ( newName === "" || newName == userData.name)
                return;
         
                const changeNameDTO = {
                    newName: newName
                };
            
            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + "/user/change_name",
                {
                    method: "POST",
                    headers: authContentHeader(),
                    body: JSON.stringify(changeNameDTO),
                
                    },
                                    

            );
            if (!response.ok) {
                const res_data = await response.json();
                alert(res_data.message);
            }
            fetchGetSet(apiUrl_profile, setUserData);
        } catch (error) {
            alert(error);
        }
    }

    return (
        <div className="mainContainerColumn" style={{ alignItems: "center" }}>
            <div className="h2">Manage your profile:</div>
            {userData ? (
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
                        />
                    </div>

                    <ManageContactsTabs />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
}

export default ManageProfile;
