import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
    ChatListDTO,
    MessageListElementDTO,
    NewChatDTO,
    ParticipantListElementDTO,
} from "./chat.DTOs";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async getChatList(userIDtoFind: number): Promise<any> {
		try {
            const chatsWithUser = await this.prisma.chat.findMany({
                where: {
                    chatUsers: {
                        some: {
                            userId: Number(userIDtoFind),
                        },
                    },
                },
            });
            return chatsWithUser.map((chat) => {

                return new ChatListDTO(chat.name, chat.id);
            });
        } catch {
            return {
                StatusCode: HttpStatus.BAD_REQUEST,
                message: "Error with DB",
            };
        }
    }

    async getMessagesByRange(chatID: number, from: number, to: number) {
        try {
            if (from == 0 && to == 0) {
                const messages = await this.prisma.message.findMany({
                    where: {
                        chatId: Number(chatID),
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                    take: 50,
                } as any);
                return messages.map((message) => {
                    return new MessageListElementDTO(
                        message.id,
                        message.content,
                        message.author
                    );
                });
            } else {
                const messages = await this.prisma.message.findMany({
                    where: {
                        chatId: Number(chatID),
                        id: {
                            gte: Number(from),
                            lte: Number(to),
                        },
                    },
                });
                return messages.map((message) => {
                    return new MessageListElementDTO(
                        message.id,
                        message.content,
                        message.author
                    );
                });
            }
        } catch {
            return {
                StatusCode: HttpStatus.BAD_REQUEST,
                message: "Error with DB",
            };
        }
    }

    async getParticipantsByChatID(chatID: number) {
        try {
            const chatUsers = await this.prisma.chat_User.findMany({
                where: {
                    chatId: Number(chatID),
                },
                include: {
                    user: true,
                },
            });

            const participants: ParticipantListElementDTO[] = chatUsers.map(
                (chatUser) => {
                    const user = chatUser.user;

                    return new ParticipantListElementDTO(
                        user ? user.name : "",
                        user ? user.id : 0,
                        chatUser.owner,
                        chatUser.admin,
                        user ? user.online : false
                    );
                }
            );

            return participants;
        } catch {
            return {
                StatusCode: HttpStatus.BAD_REQUEST,
                message: "Error with DB",
            };
        }
    }

    async dmChatExists(userId1: number, userId2: number): Promise<boolean> {
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

    async validateChat(chat: NewChatDTO) {
        if (chat.userIds.length < 2) throw { message: "Not enough users" };
        if (chat.dm) await this.validateDm(chat);
        else {
            // validate group chat: name not taken
        }
    }

    async validateDm(newChat: NewChatDTO) {
        if (newChat.userIds.length !== 2) {
            throw { message: "DM must have exactly 2 users" };
        }
        if (await this.dmChatExists(newChat.userIds[0], newChat.userIds[1])) {
            throw {
                message: `DM between ${newChat.userIds[0]} and ${newChat.userIds[1]} already exists`,
            };
        }
    }

    async createDm(newChatRequest: NewChatDTO) {
        try {
            await this.validateDm(newChatRequest);

            const newChat = await this.prisma.chat.create({
                data: {
                    name: null,
                    dm: true,
                    password: null,
                },
            });

            await this.prisma.chat_User.createMany({
                data: newChatRequest.userIds.map((userId) => ({
                    userId: userId,
                    chatId: newChat.id,
                    owner: false,
                    admin: false,
                    blocked: false,
                    muted: false,
                    invited: false,
                })),
            });

            return new ChatListDTO(newChat.name, newChat.id);
        } catch (error) {
            console.log(`error in createDm: ${error.message}`);
        }
    }

    async createChat(creatorId: number, newChatDTO: NewChatDTO) {
        newChatDTO.userIds.push(creatorId);
        try {
            if (newChatDTO.dm) {
                return await this.createDm(newChatDTO);
            }

            await this.validateChat(newChatDTO);

            const newChat = await this.prisma.chat.create({
                data: {
                    name: "newchat",
                    dm: Boolean(newChatDTO.dm),
                    password: newChatDTO.password,
                    chatUsers: {
                        createMany: {
                            data: newChatDTO.userIds.map((chatUser) => ({
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
            console.log(`error in createChat: ${error.message}`);
        }

        //return id of created chat
        // send invite, send socket update to connected parties
    }
}
