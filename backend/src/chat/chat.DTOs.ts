import { findIndex } from "rxjs";
import {
    ArrayUnique,
    ArrayMinSize,
    IsBoolean,
    IsOptional,
    IsString,
} from "class-validator";
import { Chat, Chat_User } from "@prisma/client";

export interface AckchualChat extends Chat {
    chatUsers: Chat_User[];
}

export class ChatListDTO {
    chatName: string;
    chatID: number;

    constructor(chatName: string, chatID: number) {
        this.chatName = chatName;
        this.chatID = chatID;
    }
}

export class MessageListElementDTO {
    id: number;
    content: string;
    author: number;

    constructor(id: number, content: string, author: number) {
        this.id = id;
        this.content = content;
        this.author = author;
    }
}

export class ParticipantListElementDTO {
    userName: string;
    userId: number;
    owner: boolean;
    admin: boolean;
    online: boolean;
    pictureUrl: string;

    constructor(
        userName: string,
        userId: number,
        owner: boolean,
        admin: boolean,
        online: boolean
    ) {
        this.userName = userName;
        this.userId = userId;
        this.owner = owner;
        this.admin = admin;
        this.online = online;
    }
}

export class SendMessageDTO {
    chatId: number;
    userId: number;
    content: string;

    constructor(chatID: number, userID: number, content: string) {
        this.chatId = chatID;
        this.userId = userID;
        this.content = content;
    }
}

export class EstablishConnectDTO {
    userID: number;
}

export class NewChatDTO {
    @IsBoolean()
    dm: boolean;

    @IsBoolean()
    @IsOptional()
    private?: boolean;

    @IsString()
    @IsOptional()
    password?: string;

    @ArrayMinSize(1, { message: "At least 1 user id required" })
    @ArrayUnique({ message: "User ids must be unique" })
    userIds: number[];
}

export class ChatUserDTO {
    userId: number;
    chatId: number;
    owner: boolean;
    admin: boolean;
    blocked: boolean;
    muted: boolean;
    invited: boolean;
}

export class ChatInfoDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    chatUsers: ChatUserDTO[];

    constructor(
        id: number,
        name: string,
        dm: boolean,
        isPrivate: boolean,
        passwordRequired: boolean,
        chatUsers: ChatUserDTO[]
    ) {
        this.id = id;
        this.name = name;
        this.dm = dm;
        this.isPrivate = isPrivate;
        this.passwordRequired = passwordRequired;
        this.chatUsers = chatUsers;
    }

    static fromChat(chat: AckchualChat): ChatInfoDTO {
        return new ChatInfoDTO(
            chat.id,
            chat.name,
            chat.dm,
            chat.isPrivate,
            chat.password ? true : false,
            chat.chatUsers.map((chatUser) => ({
                userId: chatUser.userId,
                chatId: chatUser.chatId,
                owner: chatUser.owner,
                admin: chatUser.admin,
                blocked: chatUser.blocked,
                muted: chatUser.muted,
                invited: chatUser.invited,
            }))
        );
    }
}

//Its json for tests
// {
//     "name": "name??",
//     "dm": false,
//     "pw_protected": false,
//     "password": false,
//     "chat_users": [
//     {
//         "userId" : 1,
//         "owner": false,
//         "admin": false,
//         "blocked": false,
//         "muted": false,
//         "invited": false
//     },
//     {
//         "userId" : 2,
//         "owner": false,
//         "admin": false,
//         "blocked": false,
//         "muted": false,
//         "invited": false
//     }
// ]
// }

export class InviteUserDTO {
    chatId: number;
    userId: number;

    constructor(chatID: number, userId: number) {
        this.chatId = chatID;
        this.userId = userId;
    }
}
