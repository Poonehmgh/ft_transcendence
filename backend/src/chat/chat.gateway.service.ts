import {Injectable} from "@nestjs/common";
import {PrismaService} from "../prisma/prisma.service";
import {SendMessageDTO} from "./chat.DTOs";
import {Socket} from "socket.io";
import {userGateway} from "./userGateway";


@Injectable()
export class ChatGatewayService {

    connectedUsers: userGateway[] = [];

    constructor(private readonly prisma: PrismaService) {
    }

    getUserIdFromSocket(socket: Socket) {
        const user: userGateway = this.connectedUsers.find((user) => user.socket === socket)
        return user.userID;
    }

    getUserSocketFromUserId(userId: number) {
        const user: userGateway = this.connectedUsers.find((user) => user.userID === userId)
        return user.socket;
    }

    deleteUserFromList(userIDToDelete: number) {
        this.connectedUsers.filter((userGateway) => userGateway.userID !== userIDToDelete);
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
            if (!await this.IsUserInChat(data.chatID, data.userID)) {
                console.log('user is not in chat');
                return -1;
            }
            const message = await this.prisma.message.create({
                data: {
                    chatId: Number(data.chatID),
                    author: Number(data.userID),
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

    sendMessageToIDList(userIdList: number[], message: SendMessageDTO, messageDestination: string) {
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
                    id: Number(messageID)
                },
                include: {
                    chat: {
                        include: {
                            chatUsers: true
                        }
                    }
                }
            });
            const userIdsWithAccess = messageDB.chat.chatUsers.map((chatUser) => chatUser.userId) || [];
            this.sendMessageToIDList(userIdsWithAccess, message, 'updateMessage');
        } catch (error) {
            console.log(`error in sendUpdateMessage: ${error.message}`);
        }
    }
}
