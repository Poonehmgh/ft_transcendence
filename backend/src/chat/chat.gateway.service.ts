import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    ChangeChatUserStatusDTO,
    ChatListDTO,
    ChatUserDTO,
    CreateNewChatDTO,
    InviteUserDTO,
    SendMessageDTO,
} from "./chat.DTOs";
import { Socket } from "socket.io";
import { hashSync } from "bcryptjs";
import { userGateway } from "./userGateway";

@Injectable()
export class ChatGatewayService {
    static connectedUsers: userGateway[] = [];

    constructor(private readonly prisma: PrismaService) {}

    printConnectedUsers() {
        console.log("Connected users:");
        ChatGatewayService.connectedUsers.forEach((user) => {
            console.log("User", user.userID, "on socket", user.socket.id);
        });
    }
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
        const user: userGateway = ChatGatewayService.connectedUsers.find(
            (user) => user.socket === socket
        );
        if (!user) return;
        return user.userID;
    }

    getUserSocketFromUserId(userId: number) {
        const user: userGateway = ChatGatewayService.connectedUsers.find(
            (user) => user.userID === userId
        );
        return user ? user.socket : null;
    }

    deleteUserFromList(userIDToDelete: number) {
        ChatGatewayService.connectedUsers = ChatGatewayService.connectedUsers.filter(
            (userGateway) => userGateway.userID !== userIDToDelete
        );
    }

    addUserToList(user: userGateway) {
        ChatGatewayService.connectedUsers.push(user);
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

    async isUserMuted(chatId: number, userId: number): Promise<Boolean> {
        const chatUser = await this.prisma.chat_User.findFirst({
            where: {
                userId: userId,
                chatId: chatId,
            },
        });
        if (chatUser.muted && chatUser.muted_until > new Date()) {
            return true;
        } else if (chatUser.muted && chatUser.muted_until < new Date()) {
            await this.prisma.chat_User.updateMany({
                where: {
                    userId: userId,
                    chatId: chatId,
                },
                data: {
                    muted: false,
                },
            });
        }
        return false;
    }

    async isUserBanned(chatId: number, userId: number): Promise<Boolean> {
        const chatUser = await this.prisma.chat_User.findFirst({
            where: {
                userId: userId,
                chatId: chatId,
            },
        });
        if (chatUser?.blocked) {
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
            if (await this.isUserMuted(data.chatId, data.userId)) {
                console.log("user is muted");
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
            await this.prisma.user.updateMany({
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

    async setUserSocketId(userId: number, socketId: string) {
        try {
            await this.prisma.user.updateMany({
                where: {
                    id: Number(userId),
                },
                data: {
                    socketId: String(socketId),
                },
            });
        } catch (error) {
            console.log(`error in setUserSocketId: ${error.message}`);
        }
    }

    async deleteUserSocketID(userID: number) {
        try {
            await this.prisma.user.updateMany({
                where: {
                    id: Number(userID),
                },
                data: {
                    socketId: "",
                },
            });
        } catch (error) {
            console.log(`error in deleteUserSocketID: ${error.message}`);
        }
    }

    sendMessageToIDList(
        userIdList: number[],
        message: SendMessageDTO,
        messageDestination: string
    ) {
        for (const id of userIdList) {
            console.log("sending message to user", id);
            const socket: Socket = this.getUserSocketFromUserId(id);
            console.log("socket:", socket?.id);
            if (socket) socket.emit(messageDestination, message);
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

    async sendDataUpdate(recipientIds: number[], event: string, data: any) {
        console.log("userids", recipientIds);
        for (const id of recipientIds) {
            const socket: Socket = this.getUserSocketFromUserId(id);
            console.log("socket:", socket?.id);
            if (socket) {
                console.log("sendDataUpdate: sending", event, "to user", id, "with data", data);
                socket.emit(event, data);
            }
        }
    }

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

    async checkIsProperDM(chat: CreateNewChatDTO) {
        if (chat.chat_users.length !== 2) {
            throw { message: "DM can have only 2 users" };
        }
        if (this.countOwners(chat.chat_users) !== 0) {
            throw { message: "DMs cant have owners" };
        }
        const names: string[] = chat.name.split(":");
        if (!names || names.length !== 2) {
            throw { message: "Wrong DM name format" };
        }
        if (
            await this.checkIfDMChatExists(
                chat.chat_users[0].userId,
                chat.chat_users[1].userId
            )
        ) {
            throw { message: "There could be only one DM chat between 2 users" };
        }
    }

   /*  async checkIsProperChat(chat: CreateNewChatDTO) {
        if (chat.chat_users.length < 2) throw { message: "Not enough users" };
        const ownerCount: number = this.countOwners(chat.chat_users);
        if (ownerCount > 1) throw { message: "Too much owners" };
        if (chat.dm) await this.checkIsProperDM(chat);
    } */
/* 
    async createNewEmptyChat(data: CreateNewChatDTO) {
        try {
            await this.checkIsProperChat(data);
            const newChat = await this.prisma.chat.create({
                data: {
                    name: data.name,
                    dm: Boolean(data.dm),
                    password: data.password,
                    chatUsers: {
                        createMany: {
                            data: data.chat_users.map((chatUser) => ({
                                userId: chatUser.userId,
                                owner: chatUser.owner,
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
    } */

    // replaced with sendChatUpdate
/*     async sendChatCreationUpdate(chat: ChatListDTO) {
        console.log("sending chat update");
        try {
            const chatRes = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chat.chatId),
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
                    console.log("sendChatCreationUpdate sending to user ", user.userId);
                    if (socket)
                        socket.emit("updateChat", chat);
                }
            }
        } catch (error) {
            console.log(`error in sendChatCreationUpdate: ${error.message}`);
        }
    } */

    // function not used, replaced with sendChatUpdate. didnt actually send updates to everyone...
    //send updates to everyone in chat
   /*  async sendChatAdditionUpdate(inviteForm: InviteUserDTO) {
        const chatName = await this.getChatNameFromID(inviteForm.chatId);
        const socket: Socket = this.getUserSocketFromUserId(inviteForm.userId);
        if (socket)
            socket.emit("updateChat", new ChatListDTO(chatName, inviteForm.chatId));
    } */

    async sendChatUpdate(chatId: number) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chatId),
                },
                include: {
                    chatUsers: {
                        select: {
                            userId: true,
                        },
                    },
                },
            });
            if (chat) {
                for (const user of chat.chatUsers) {
                    const socket: Socket = this.getUserSocketFromUserId(user.userId);
                    console.log("sending updateChat event to user", user.userId);
                    if (socket)
                        socket.emit("updateChat", new ChatListDTO(chat.name, chatId));
                }
            }
        } catch (error) {
            console.log(`error in sendChatUpdate: ${error.message}`);
        }
    }

    async getPasswordFromChat(chatId: number) {
        const chat = await this.prisma.chat.findUnique({
            where: {
                id: chatId,
            },
        });
        return chat.password;
    }

    async isChatPassworded(chatId: number) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
                password: {
                    not: null,
                },
            },
        });
        if (chat) return true;
        return false;
    }
    async checkIsPossibleToAddInChatWithPassword(
        inviteForm: InviteUserDTO,
        inviter: Socket
    ) {
        if (!(await this.isChatPassworded(inviteForm.chatId))) {
            return true;
        }
        const inviterId: number = this.getUserIdFromSocket(inviter);
        if (await this.IsUserInChat(inviteForm.chatId, inviterId)) {
            return true;
        }
        const hashedPassword = await this.getPasswordFromChat(inviteForm.chatId);
        if (hashedPassword === hashSync(inviteForm.password, "salt")) {
            return true;
        }
        return false;
    }

    async inviteUserToChat(inviteForm: InviteUserDTO, inviter: Socket) {
        if (
            !(await this.IsUserInChat(inviteForm.chatId, inviteForm.userId)) &&
            !(await this.isUserBanned(inviteForm.chatId, inviteForm.userId)) &&
            (await this.checkIsPossibleToAddInChatWithPassword(inviteForm, inviter))
        ) {
            var chatUser = await this.prisma.chat_User.create({
                data: {
                    chatId: inviteForm.chatId,
                    userId: inviteForm.userId,
                },
            });
            if (chatUser) await this.sendChatUpdate(inviteForm.chatId);
        }
    }

    async getChatUserObjectFromId(userId: number, chatId: number) {
        return this.prisma.chat_User.findFirst({
            where: {
                chatId: chatId,
                userId: userId,
            },
        });
    }

    getNeededPermissionLevel(user, changeForm: ChangeChatUserStatusDTO): string {
        if (user.owner || user.admin || changeForm.owner) {
            return "owner";
        }
        return "admin";
    }

    getStatusToChange(user, changeForm: ChangeChatUserStatusDTO): string {
        let action = "none";

        if (changeForm.kick) action = "kick";
        else if (user.owner != changeForm.owner) action = "owner";
        else if (user.admin != changeForm.admin) action = "admin";
        else if (user.muted != changeForm.muted) action = "mute";
        else if (user.banned != changeForm.banned) action = "ban";
        console.log("getStatusToChange:", action);
        return action;
    }

    async changeOwner(changeForm: ChangeChatUserStatusDTO) {
        console.log("changeOwner");
        //dont mind that its update many, its just easier to use
        await this.prisma.chat_User.updateMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
            data: {
                owner: true,
                admin: true,
            },
        });
        await this.prisma.chat_User.updateMany({
            where: {
                userId: Number(changeForm.operatorId),
                chatId: Number(changeForm.chatId),
            },
            data: {
                owner: false,
            },
        });
        this.sendChatUpdate(changeForm.chatId);
    }

    async changeAdmin(changeForm: ChangeChatUserStatusDTO) {
        console.log("changeAdmin");
        //dont mind that its update many, its just easier to use
        await this.prisma.chat_User.updateMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
            data: {
                admin: Boolean(changeForm.admin),
            },
        });
        this.sendChatUpdate(changeForm.chatId);
    }

    async kickChatUser(changeForm: ChangeChatUserStatusDTO) {
        console.log("kickChatUser");
        await this.prisma.chat_User.deleteMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
        });
        this.sendDataUpdate([changeForm.userId], "updateChat", new ChatListDTO("noone cares", changeForm.chatId) );
        this.sendChatUpdate(changeForm.chatId);
    }

    async muteChatUser(changeForm: ChangeChatUserStatusDTO) {
        console.log("muteChatUser");
        if (!changeForm.muted) {
            await this.prisma.chat_User.updateMany({
                where: {
                    userId: Number(changeForm.userId),
                    chatId: Number(changeForm.chatId),
                },
                data: {
                    muted: false,
                },
            });
            this.sendChatUpdate(changeForm.chatId);
            return;
        }
        const mutedUntil = new Date();
        mutedUntil.setMinutes(mutedUntil.getMinutes() + 5);
        await this.prisma.chat_User.updateMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
            data: {
                muted: true,
                muted_until: mutedUntil,
            },
        });
        this.sendChatUpdate(changeForm.chatId);
    }

    async banChatUser(changeForm: ChangeChatUserStatusDTO) {
        console.log("banChatUser");
        await this.prisma.chat_User.updateMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
            data: {
                banned: changeForm.banned,
            },
        });
        this.sendChatUpdate(changeForm.chatId);
        
        //this.kickChatUser(changeForm);
    }

    async changeUsersInChatStatus(changeForm: ChangeChatUserStatusDTO) {
        try {
            if (!(await this.IsUserInChat(changeForm.chatId, changeForm.userId))) {
                var socket: Socket = this.getUserSocketFromUserId(changeForm.operatorId);
                socket.emit("error", "User is not in chat");
                return -1;
            }
            const operatorUser = await this.getChatUserObjectFromId(
                changeForm.operatorId,
                changeForm.chatId
            );
            const changeUser = await this.getChatUserObjectFromId(
                changeForm.userId,
                changeForm.chatId
            );
            if (
                this.getNeededPermissionLevel(changeForm, changeForm) == "owner" &&
                operatorUser.owner == false
            )
                throw { message: "You dont have permission to change owner" };
            if (
                this.getNeededPermissionLevel(changeForm, changeForm) == "admin" &&
                operatorUser.admin == false
            )
                throw { message: "You dont have permission to change owner" };
            const statusToChange = this.getStatusToChange(changeUser, changeForm);
            if (statusToChange == "owner") this.changeOwner(changeForm);
            if (statusToChange == "admin") this.changeAdmin(changeForm);
            if (statusToChange == "kick") this.kickChatUser(changeForm);
            if (statusToChange == "mute") this.muteChatUser(changeForm);
            if (statusToChange == "ban") this.banChatUser(changeForm);
            if (statusToChange == "none") throw { message: "Nothing to change" };
        } catch (error) {
            console.log(`error in changeUsersInChatStatus: ${error.message}`);
        }
    }
}
