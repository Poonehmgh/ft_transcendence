import React, { useContext } from "react";

// Contexts
import { SocketContext } from "src/contexts/SocketProvider";

// CSS
import "src/styles/style.css";

interface InviteButtonProps {
    invitedId: number;
    invitedName: string;
}

function InviteButton(props: InviteButtonProps) {
    const socket = useContext(SocketContext);

    function inviteUserToMatch() {
        if (window.confirm(`Invite ${props.invitedName} to a pongers match?`))
            socket.emit("matchInvite", { recipientId: props.invitedId });
    }

    return (
        <button className="bigButton" onClick={() => inviteUserToMatch()}>
            Invite to Match
        </button>
    );
}

export default InviteButton;
