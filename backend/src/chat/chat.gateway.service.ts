import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Socket } from "socket.io";
import { compareSync, hashSync } from "bcryptjs";
import { UserService } from "src/user/user.service";
import { GameQueue, userGateway as GameUserGateway } from "src/game/game.queue";

// DTO
import {
    ChangeChatUserStatusDTO,
    ChatIdDTO,
    Chat_ChatUser,
    GameInviteDTO,
    GameInviteAction,
    JoinChatDTO,
    SendMessageDTO,
} from "./chat.DTOs";
import { userGateway } from "./userGateway";

@Injectable()
export class ChatGatewayService {
    static connectedUsers: userGateway[] = [];

    constructor(
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly gameQueue: GameQueue
    ) {}

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

    deleteUserFromList(userIDToDelete: number) {
        ChatGatewayService.connectedUsers = ChatGatewayService.connectedUsers.filter(
            (userGateway) => userGateway.userID !== userIDToDelete
        );
    }

    addUserToList(user: userGateway) {
        ChatGatewayService.connectedUsers.push(user);
    }

    // storing socket for game

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

    // getters

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

    // checkers

    isUserInChat(chat: Chat_ChatUser, userId: number) {
        return chat.chatUsers.find((user) => user.userId === userId);
    }

    isUserBanned(chat: Chat_ChatUser, userId: number) {
        return chat.chatUsers.find((user) => user.userId === userId && user.banned);
    }

    isPasswordCorrect(chat: Chat_ChatUser, passwordInput: string) {
        const result = compareSync(passwordInput, chat.passwordHash);
        console.log("checkPassword result:", result ? "correct" : "incorrect");
        return result;
    }

    async isUserInChat_prisma(chatId: number, userId: number) {
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

    async isUserBanned_prisma(chatId: number, userId: number): Promise<Boolean> {
        const chatUser = await this.prisma.chat_User.findFirst({
            where: {
                userId: userId,
                chatId: chatId,
            },
        });
        if (chatUser?.banned) {
            return true;
        } else {
            return false;
        }
    }

    // manipulation

    async joinChat(joinChatDto: JoinChatDTO) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: joinChatDto.chatId,
                },
                include: {
                    chatUsers: true,
                },
            });

            if (this.isUserInChat(chat, joinChatDto.userId)) {
                throw new Error("User is already in chat");
            }
            if (this.isUserBanned(chat, joinChatDto.userId)) {
                throw new Error("User is banned from chat");
            }
            if (chat.passwordHash != null) {
                if (!this.isPasswordCorrect(chat, joinChatDto.password)) {
                    throw new Error("Password is incorrect");
                }
            }

            await this.prisma.chat_User.create({
                data: {
                    chatId: joinChatDto.chatId,
                    userId: joinChatDto.userId,
                },
            });

            await this.sendDataEventToList([joinChatDto.userId], "joinChatSuccess", null);
            await this.sendEventToChat(joinChatDto.chatId, "updateChat");
        } catch (error) {
            console.log(`error in joinChat: ${error.message}`);
            await this.sendDataEventToList([joinChatDto.userId], "errorAlert", {
                message: error.message,
            });
        }
    }

    async addMessageToChat(data: SendMessageDTO) {
        try {
            if (!(await this.isUserInChat_prisma(data.chatId, data.userId))) {
                console.log("user is not in chat");
                return -1;
            }
            if (await this.isUserMuted(data.chatId, data.userId)) {
                console.log("user is muted");
                return -1;
            }
            if (await this.isUserBanned_prisma(data.chatId, data.userId)) {
                console.log("user is banned");
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

    /*    sendMessageToIDList(
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
    } */

    /*  async sendUpdateMessages(messageID: number, message: SendMessageDTO) {
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
                            chatUsers: {
                                where: {
                                    banned: false,
                                },
                            },
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
    } */

    // sending

    async sendDataEventToList(recipientIds: number[], event: string, data: any) {
        console.log("sendDataEventToList: ", recipientIds);
        for (const id of recipientIds) {
            const socket: Socket = this.getUserSocketFromUserId(id);
            console.log(`socket for ${id}: ${socket?.id}`);
            if (socket) {
                console.log(
                    "sendDataEventToList: sending",
                    event,
                    "to user:",
                    id,
                    "with data:",
                    data
                );
                socket.emit(event, data);
            }
        }
    }

    // not for transmitting flexible data, just sends an event (payload chatId) to all active members of a chat
    async sendEventToChat(chatId: number, event: string) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chatId),
                },
                include: {
                    chatUsers: {
                        where: {
                            banned: false,
                        },
                        select: {
                            userId: true,
                        },
                    },
                },
            });
            if (chat) {
                for (const user of chat.chatUsers) {
                    console.log(`sending "${event}" to ${user.userId}`);
                    const socket: Socket = this.getUserSocketFromUserId(user.userId);
                    if (socket) socket.emit(event, new ChatIdDTO(chatId));
                }
            }
        } catch (error) {
            console.log(`error in updateChat: ${error.message}`);
        }
    }

    // unordered

    /*  async getPasswordFromChat(chatId: number) {
        const chat = await this.prisma.chat.findUnique({
            where: {
                id: chatId,
            },
        });
        return chat.passwordHash;
    }

    async isChatPassworded(chatId: number) {
        const chat = await this.prisma.chat.findFirst({
            where: {
                id: chatId,
                passwordHash: {
                    not: null,
                },
            },
        });
        if (chat) return true;
        return false;
    } */

    /*    async checkIsPossibleToAddInChatWithPassword(
        inviteForm: JoinChatDTO,
        inviter: Socket
    ) {
        if (!(await this.isChatPassworded(inviteForm.chatId))) {
            return true;
        }
        const inviterId: number = this.getUserIdFromSocket(inviter);
        if (await this.isUserInChat_prisma(inviteForm.chatId, inviterId)) {
            return true;
        }
        const hashedPassword = await this.getPasswordFromChat(inviteForm.chatId);
        if (hashedPassword === hashSync(inviteForm.password, "salt")) {
            return true;
        }
        return false;
    } */

    /*   async inviteUserToChat(inviteForm: JoinChatDTO, inviter: Socket) {
        if (
            !(await this.isUserInChat_prisma(inviteForm.chatId, inviteForm.userId)) &&
            !(await this.isUserBanned_prisma(inviteForm.chatId, inviteForm.userId)) &&
            (await this.checkIsPossibleToAddInChatWithPassword(inviteForm, inviter))
        ) {
            var chatUser = await this.prisma.chat_User.create({
                data: {
                    chatId: inviteForm.chatId,
                    userId: inviteForm.userId,
                },
            });
            if (chatUser) await this.sendEventToChat(inviteForm.chatId, "updateChat");
        }
    } */

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

    // role changes

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
        this.sendEventToChat(changeForm.chatId, "updateChat");
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
        this.sendEventToChat(changeForm.chatId, "updateChat");
    }

    async kickChatUser(changeForm: ChangeChatUserStatusDTO) {
        console.log("kickChatUser");
        await this.prisma.chat_User.deleteMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
        });
        this.sendDataEventToList(
            [changeForm.userId],
            "updateChat",
            new ChatIdDTO(changeForm.chatId)
        );
        this.sendEventToChat(changeForm.chatId, "updateChat");
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
            this.sendEventToChat(changeForm.chatId, "updateChat");
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
        this.sendEventToChat(changeForm.chatId, "updateChat");
    }

    async banChatUser(changeForm: ChangeChatUserStatusDTO) {
        console.log("banChatUser");
        if (!changeForm.banned) {
            console.log("unbanning resulting in kick");
            this.kickChatUser(changeForm);
            return;
        }
        await this.prisma.chat_User.updateMany({
            where: {
                userId: Number(changeForm.userId),
                chatId: Number(changeForm.chatId),
            },
            data: {
                banned: changeForm.banned,
            },
        });
        this.sendDataEventToList(
            [changeForm.userId],
            "updateChat",
            new ChatIdDTO(changeForm.chatId)
        );
        this.sendEventToChat(changeForm.chatId, "updateChat");
    }

    async changeUsersInChatStatus(changeForm: ChangeChatUserStatusDTO) {
        try {
            if (!(await this.isUserInChat_prisma(changeForm.chatId, changeForm.userId))) {
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

    // game invites

    async inviteUserToMatch(recipientId: number, userSocket: Socket) {
        try {
            const inviterId = this.getUserIdFromSocket(userSocket);
            if (!inviterId) {
                throw new Error("inviterId not found");
            }
            const recipient = await this.userService.getUserById(recipientId);
            if (!recipient) {
                throw new Error("Recipient not found");
            }
            if (inviterId in recipient.blocked) {
                throw new Error("You are blocked by this user");
            }
            if (this.gameQueue.isUserInQueue(recipientId)) {
                throw new Error("User is already queueing");
            }
            if (this.gameQueue.isUserInMatch(recipientId)) {
                throw new Error("User is already in a match");
            }
            const inviterName = await this.userService.getNameById(inviterId);
            // this throws on fail
            const recipientSocket = this.getUserSocketFromUserId(recipientId);
            if (!recipientSocket) {
                throw new Error("Recipient is not online");
            }

            const inviteData = new GameInviteDTO(
                inviterId,
                inviterName,
                recipientId,
                recipient.name,
                GameInviteAction.invite
            );

            recipientSocket.emit("matchInvite", inviteData);
        } catch (error) {
            console.log(`error in inviteUserToMatch: ${error.message}`);
            userSocket.emit("errorAlert", { message: error.message });
        }
    }

    async acceptMatchInvite(data: GameInviteDTO) {
        try {
            const inviterSocket = this.getUserSocketFromUserId(data.inviterId);
            const inviteeSocket = this.getUserSocketFromUserId(data.inviteeId);
            if (!inviterSocket || !inviteeSocket) {
                throw new Error("One of the users is not online");
            }

            data.action = GameInviteAction.matchBegin;

            this.sendDataEventToList(
                [data.inviterId, data.inviteeId],
                "matchInvite",
                data
            );

            this.gameQueue.initGame(
                new GameUserGateway(data.inviterId, inviterSocket),
                new GameUserGateway(data.inviteeId, inviteeSocket)
            );
        } catch (error) {
            console.log(`error in acceptMatchInvite: ${error.message}`);
            this.sendDataEventToList([data.inviterId, data.inviteeId], "errorAlert", {
                message: error.message,
            });
        }
    }

    declineMatchInvite(data: GameInviteDTO) {
        try {
            const inviterSocket = this.getUserSocketFromUserId(data.inviterId);
            if (!inviterSocket) {
                throw new Error("Inviter is not online");
            }
            data.action = GameInviteAction.declineInvite;
            inviterSocket.emit("matchInvite", data);
        } catch (error) {
            console.log(`error in declineMatchInvite: ${error.message}`);
        }
    }
}
