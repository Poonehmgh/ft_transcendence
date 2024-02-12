import React, { useContext, useEffect, useState } from "react";
import { fetchGetSet } from "src/functions/utils";
import LeftBar from "src/components/Chat/LeftBar/LeftBar_main";
import RightBar from "src/components/Chat/RightBar/RightBar_main";
import LoadingH2 from "src/components/shared/LoadingH2";

// DTO
import { ChatInfoDTO, ChatUserDTO, SendMessageDTO } from "src/dto/chat-dto";

// CSS
import "../../styles/chat.css";
import "../../styles/style.css";
import backendUrl from "src/constants/backendUrl";
import { SocketContext } from "src/contexts/socketContext";

function Chat() {
    const [selectedChat, setSelectedChat] = useState<ChatInfoDTO | null>(null);
    const [selectedMember, setSelectedMember] = useState<ChatUserDTO | null>(null);
    const [chats, setChats] = useState<ChatInfoDTO[]>(null);
    const apiUrl = backendUrl.chat + "my_chats";

    const socket = useContext(SocketContext);

    useEffect(() => {
        const handleNewChatMessage = (message: any) => {
            alert(`New chat message: ${message}`);
        };

        socket.on('chat message', handleNewChatMessage);

        return () => {
            socket.off('chat message', handleNewChatMessage);
        };
    }, [socket]);

	function sendTestMsg() {
		const id_message =  { userID: 98525};
		socket.emit('sendMessage', id_message);

		const message = new SendMessageDTO(1, 98525, "Hello, knudelings!");
		socket.emit('sendMessage', message);
	}

    function selectChat(newChat: ChatInfoDTO) {
        setSelectedChat(newChat);
        setSelectedMember(null);
    }

    useEffect(() => {
        fetchGetSet<ChatInfoDTO[]>(apiUrl, setChats);
    }, [apiUrl]);

    if (!chats) return <LoadingH2 elementName={"Chat"} />;

    return (
        <div className="mainContainerColumn">
            <div className="h2">{selectedChat ? selectedChat.name : "Chat"}</div>
            <div className="chatMain">
                <LeftBar
                    selectedChat={selectedChat}
                    selectChat={selectChat}
                    chats={chats}
                />

                <div className="middleBar_0">
					<button className="bigButton" onClick={sendTestMsg}>
						Knudeling
					</button>
				</div>

                <RightBar
                    selectedChat={selectedChat}
                    selectedMember={selectedMember}
                    setSelectedMember={setSelectedMember}
                />
            </div>
        </div>
    );
}

export default Chat;
