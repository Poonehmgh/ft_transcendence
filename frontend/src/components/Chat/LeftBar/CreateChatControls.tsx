import React, { useEffect, useRef, useState } from "react";

// DTO
import { ChatListDTO, NewChatDTO } from "src/dto/chat-dto";

// CSS
import "src/styles/modals.css";
import "src/styles/buttons.css";

interface CreateChatControlsProps {
    newChatDTO: NewChatDTO;
    createChat: () => void;
    setIsPrivate: () => void;
    passwordRef: React.MutableRefObject<HTMLInputElement | null>;
}

function CreateChatControls(props: CreateChatControlsProps): React.JSX.Element {
    const [usePassword, setUsePassword] = useState(false);
    const [isPasswordStateValid, setIsPasswordStateValid] = useState(true);

    const apiUrl = process.env.REACT_APP_BACKEND_URL + "/chat/create";

    function validatePassword() {
        if (!usePassword || !props.passwordRef.current) {
            setIsPasswordStateValid(true);
            return;
        }
        const minLength = 3;
        setIsPasswordStateValid(props.passwordRef.current.value.length >= minLength);
    }

    useEffect(() => {
        validatePassword();
        console.log("isPasswordStateValid:", isPasswordStateValid);
        console.log("usePassword:", usePassword);
        console.log("password length:", props.passwordRef.current?.value.length);
    }, [usePassword]);

    if (props.newChatDTO.userIds.length === 0) return null;

    return (
        <div>
            <button
                className="bigButton"
                style={{ width: "100%" }}
                onClick={props.createChat}
                disabled={!isPasswordStateValid}
            >
                {props.newChatDTO.userIds.length === 1
                    ? "Create DM Chat"
                    : "Create Group Chat"}
            </button>
            {props.newChatDTO.userIds.length > 1 && (
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <br />
                    <div className="checkboxContainer">
                        <input
                            type="checkbox"
                            className="checkbox"
                            onClick={() => setUsePassword(!usePassword)}
                        />
                        Use Password
                        {usePassword && (
                            <input
                                type="text"
                                className="textInput"
                                style={{ marginLeft: "15px" }}
                                placeholder="Your password. Min. 3 characters."
                                ref={props.passwordRef}
                                onChange={validatePassword}
                            />
                        )}
                    </div>
                    <div className="checkboxContainer">
                        <input
                            type="checkbox"
                            className="checkbox"
                            onClick={props.setIsPrivate}
                        />
                        Make Public
                    </div>
                </div>
            )}
        </div>
    );
}

export default CreateChatControls;
