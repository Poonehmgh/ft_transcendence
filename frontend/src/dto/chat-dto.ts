// to backend

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

export class NewChatDTO {
    dm: boolean;
    isPrivate: boolean;
    password?: string = null;
    userIds: number[];
}

export class InviteUserDTO {
    chatId: number;
    userId: number;
    password: string;

    constructor(chatID: number, userId: number, password: string) {
        this.chatId = chatID;
        this.userId = userId;
        this.password = password;
    }
}

// from backend

export class MessageDTO {
    id: number;
    timeStamp: Date;
    content: string;
    authorId: number;

    constructor(id: number, timeStamp: Date, content: string, authorId: number) {
        this.id = id;
        this.timeStamp = timeStamp;
        this.content = content;
        this.authorId = authorId;
    }
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

export class ExtendedChatUserDTO extends ChatUserDTO {
    userName: string;
}

export class Chat_ChatUsersDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    chatUsers: ChatUserDTO[];
}

export class ChatDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
    chatUsers: ExtendedChatUserDTO[];
    messages: MessageDTO[];
}

export class BasicChatDTO {
    id: number;
    name: string;
    dm: boolean;
    isPrivate: boolean;
    passwordRequired: boolean;
}
