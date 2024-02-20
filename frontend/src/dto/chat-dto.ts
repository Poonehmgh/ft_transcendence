// only frontend use

export enum ChatRole {
    owner = 3,
    admin = 2,
    member = 1,
    banned = 0,
}

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

export class ChangeChatUserStatusDTO {
    operatorId: number;
    chatId: number;
    userId: number;
    owner: boolean;
    muted: boolean;
    banned: boolean;
    admin: boolean;
    kick: boolean;
    constructor(
        operatorId: number,
        chatId: number,
        userId: number,
        owner: boolean,
        muted: boolean,
        banned: boolean,
        admin: boolean
    ) {
        this.operatorId = operatorId;
        this.chatId = chatId;
        this.userId = userId;
        this.owner = owner;
        this.muted = muted;
        this.banned = banned;
        this.admin = admin;
    }
}

// from backend

export class MessageDTO {
    id: number;
    timeStamp: Date;
    content: string;
    authorId: number;
    chatId: number;

    constructor(
        id: number,
        timeStamp: Date,
        content: string,
        authorId: number,
        chatId: number
    ) {
        this.id = id;
        this.timeStamp = timeStamp;
        this.content = content;
        this.authorId = authorId;
        this.chatId = chatId;
    }
}

export class ChatUserDTO {
    userId: number;
    chatId: number;
    owner: boolean;
    admin: boolean;
    blocked: boolean;
    muted: boolean;
    mutedUntil?: Date;
    banned: boolean;
}

export class ExtendedChatUserDTO extends ChatUserDTO {
    userName: string;
}

export class BasicChatWithUsersDTO {
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

export class ChatListDTO {
    chatName: string;
    chatId: number;

    constructor(chatName: string, chatId: number) {
        this.chatName = chatName;
        this.chatId = chatId;
    }
}

// socket events

export class ChatIdDTO {
    chatId: number;

    constructor(chatId: number) {
        this.chatId = chatId;
    }
}
