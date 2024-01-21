import React, { useState, useEffect, useRef } from "react";
import { authContentHeader } from "src/ApiCalls/headers";
import ManageContactsTabs from "./ManageContactsTabs";
import PlayerCardTable from "../shared/PlayerCardTable";
import { fetchGetSet } from "src/ApiCalls/fetchers";

// DTO
import { UserProfileDTO } from "user-dto";

// CSS
import "src/styles/buttons.css";
import "src/styles/style.css";
import "src/styles/manageProfile.css";

function ManageProfile() {
    const [userData, setUserData] = useState<UserProfileDTO | null>(null);
    const [avatarURL, setAvatarURL] = useState(null);
    const fileInputRef = useRef(null);
    const id = 0; //this is just temp

    function handleChooseFileClick() {
        fileInputRef.current.click();
    }

    async function fetchAvatar() {
        const apiUrl = process.env.REACT_APP_BACKEND_URL + "/user/get_avatar/" + id;
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

    const apiUrl_profile = process.env.REACT_APP_BACKEND_URL + "/user/profile?id=" + id;

    useEffect(() => {
        fetchGetSet(apiUrl_profile, setUserData);
        fetchAvatar();
    }, []);

    async function handleAvatarChange(e) {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("avatar", file);
        try {
            await fetch(process.env.REACT_APP_BACKEND_URL + `/user/put_avatar/${id}`, {
                method: "POST",
                body: formData,
            });
        } catch (error) {
            console.log(error);
        }
        fetchAvatar();
    }

    async function handleNameChange() {
        try {
            const newName = prompt("Enter a new name:");

            if (newName === null || newName.trim() === "") {
                return;
            }
            const data = {
                id: id,
                newName: newName,
            };
            const response = await fetch(
                process.env.REACT_APP_BACKEND_URL + "/user/change_name",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
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
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
            }}
        >
            <div className="h2">Manage your profile:</div>
            {userData ? (
                <div className="manageProfile">
                    <div className="leftAligner">
                        <div className="h2" style={{textAlign:"left"}}>
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

                    <ManageContactsTabs id={id} />

                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleAvatarChange}
                    />
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
}

export default ManageProfile;
