import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    ChatListDTO,
    ChatUserDTO,
    InviteUserDTO,
    SendMessageDTO,
} from "./chat.DTOs";
import { Socket } from "socket.io";
import { userGateway } from "./userGateway";

@Injectable()
export class ChatGatewayService {
    connectedUsers: userGateway[] = [];

    constructor(private readonly prisma: PrismaService) {}

    async setAllUsersOffline(): Promise<void> {
        await this.prisma.user.updateMany({
            data: {
                online: false,
            },
        });
    }

    async getChatNameFromID(chatID: number): Promise<string> {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatID,
            },
        });
        return chat.name;
    }

    getUserIdFromSocket(socket: Socket) {
        const user: userGateway = this.connectedUsers.find(
            (user) => user.socket === socket
        );
        return user.userID;
    }

    getUserSocketFromUserId(userId: number) {
        const user: userGateway = this.connectedUsers.find(
            (user) => user.userID === userId
        );
        return user.socket;
    }

    deleteUserFromList(userIDToDelete: number) {
        this.connectedUsers.filter(
            (userGateway) => userGateway.userID !== userIDToDelete
        );
        console.log(this.connectedUsers);
    }

    addUserToList(user: userGateway) {
        this.connectedUsers.push(user);
    }

    async IsUserInChat(chatId: number, userId: number) {
        const chatUser = await this.prisma.chat_User.findFirst({
            where: {
                userId: userId,
                chatId: chatId,
            },
        });
        if (chatUser) {
            return true;
        } else {
            return false;
        }
    }

    //maybe add protection so users not in chat cant update it
    async addMessageToChat(data: SendMessageDTO) {
        try {
            if (!(await this.IsUserInChat(data.chatId, data.userId))) {
                console.log("user is not in chat");
                return -1;
            }
            const message = await this.prisma.message.create({
                data: {
                    chatId: Number(data.chatId),
                    author: Number(data.userId),
                    content: data.content,
                },
            });
            return message.id;
        } catch (error) {
            console.log(`error in addMessageToChat: ${error.message}`);
        }
    }

    async setUserOnlineStatus(userID: number, status: boolean) {
        try {
            await this.prisma.user.update({
                where: {
                    id: Number(userID),
                },
                data: {
                    online: Boolean(status),
                },
            });
        } catch (error) {
            console.log(`error in setUserOnlineStatus: ${error.message}`);
        }
    }

    sendMessageToIDList(
        userIdList: number[],
        message: SendMessageDTO,
        messageDestination: string
    ) {
        for (const id of userIdList) {
            const socket: Socket = this.getUserSocketFromUserId(id);
            socket.emit(messageDestination, message);
        }
    }

    async sendUpdateMessages(messageID: number, message: SendMessageDTO) {
        try {
            if (messageID == -1) {
                return;
            }
            const messageDB = await this.prisma.message.findUnique({
                where: {
                    id: Number(messageID),
                },
                include: {
                    chat: {
                        include: {
                            chatUsers: true,
                        },
                    },
                },
            });
            const userIdsWithAccess =
                messageDB.chat.chatUsers.map((chatUser) => chatUser.userId) || [];
            this.sendMessageToIDList(userIdsWithAccess, message, "updateMessage");
        } catch (error) {
            console.log(`error in sendUpdateMessage: ${error.message}`);
        }
    }

    // moved to chatService and renamed
    async checkIfDMChatExists(userId1: number, userId2: number): Promise<boolean> {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                dm: true,
                chatUsers: {
                    every: {
                        userId: { in: [userId1, userId2] },
                    },
                },
            },
        });

        return !!existingChat; // Returns true if an existing chat is found, false otherwise.
    }

    countOwners(chat_users: ChatUserDTO[]): number {
        let counter: number = 0;
        for (const user of chat_users) {
            if (user.owner == true) counter++;
        }
        return counter;
    }

    /*

    // moved to chatService and renamed and updated
    async checkIsProperDM(chat: NewChatDTO) {
        if (chat.userIds.length !== 2) {
            throw {message: "DM can have only 2 users"};
        }
        const names: string[] = chat.name.split(':');
        if (!names || names.length !== 2) {
            throw {message: "Wrong DM name format"};
        }
        if (await this.checkIfDMChatExists(chat.userIds[0], chat.userIds[1])) {
            throw {message: "There can be only one DM chat between 2 users"};
        }
    }

    // moved to chatService and renamed to validateChat
     async checkIsProperChat(chat: NewChatDTO) {
        if (chat.userIds.length < 2)
            throw {message: "Not enough users"};
        /* const ownerCount: number = this.countOwners(chat.userIds);
        if (ownerCount > 1)
            throw {message: "Too much owners"};
        if (chat.dm)
            await this.checkIsProperDM(chat);
    } 
    

    // moved to chatService
    async createNewEmptyChat(data: NewChatDTO) {
        try {
            await this.checkIsProperChat(data);
            const newChat = await this.prisma.chat.create({
                data: {
                    name: data.name,
                    dm: Boolean(data.dm),
                    pw_protected: Boolean(data.pw_protected),
                    password: data.password,
                    chatUsers: {
                        createMany: {
                            data: data.userIds.map((chatUser) => ({
                                userId: chatUser,
                                //owner: chatUser.owner
                            })),
                        },
                    },
                },
                include: {
                    chatUsers: true,
                },
            });
            return new ChatListDTO(newChat.name, newChat.id);
        } catch (error) {
            console.log(`error in createNewEmptyChat: ${error.message}`);
        }
    }
    
    */

    async sendChatCreationUpdate(chat: ChatListDTO) {
        try {
            const chatRes = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chat.chatID),
                },
                include: {
                    chatUsers: {
                        select: {
                            userId: true,
                        },
                    },
                },
            });
            if (chatRes) {
                for (const user of chatRes.chatUsers) {
                    const socket: Socket = this.getUserSocketFromUserId(user.userId);
                    socket.emit("updateChat", chat);
                }
            }
        } catch (error) {
            console.log(`error in sendChatCreationUpdate: ${error.message}`);
        }
    }

    async sendChatAdditionUpdate(inviteForm: InviteUserDTO) {
        const chatName = await this.getChatNameFromID(inviteForm.chatId);
        const socket: Socket = this.getUserSocketFromUserId(inviteForm.userId);
        socket.emit("updateChat", new ChatListDTO(chatName, inviteForm.userId));
    }

    async inviteUserToChat(inviteForm: InviteUserDTO) {
        if (!(await this.IsUserInChat(inviteForm.chatId, inviteForm.userId))) {
            var chatUser = await this.prisma.chat_User.create({
                data: {
                    chatId: inviteForm.chatId,
                    userId: inviteForm.userId,
                },
            });
            if (chatUser) await this.sendChatAdditionUpdate(inviteForm);
        }
    }
}
