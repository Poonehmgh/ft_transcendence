import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Chat, Chat_User } from "@prisma/client";

import {
    AckchualChat,
    ChatInfoDTO,
    ChatUserDTO,
    MessageListElementDTO,
    NewChatDTO,
    ParticipantListElementDTO,
} from "./chat.DTOs";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {}

    async getChatName(chatId: number, userId: number): Promise<string> {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chatId),
                },

                include: {
                    chatUsers: true,
                },
            });

            if (chat.dm) {
                const otherUserId = chat.chatUsers.find(
                    (e) => e.userId !== userId
                ).userId;

                const otherUser = await this.prisma.user.findUnique({
                    where: {
                        id: otherUserId,
                    },
                });

                return otherUser.name;
            }
            if (chat.name) return chat.name;
            return "Unnamed Chat";
        } catch (error) {
            console.error("Error in getChatName:", error);
            throw error;
        }
    }

    async getUserChats(userId): Promise<ChatInfoDTO[]> {
        try {
            const userChats = await this.prisma.chat.findMany({
                where: {
                    chatUsers: {
                        some: {
                            userId: userId,
                        },
                    },
                },
                include: {
                    chatUsers: true,
                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 1, // Change this according to your requirements
                    },
                },
            });

            return userChats.map((chat: AckchualChat) => {
                return {
                    id: chat.id,
                    name: chat.name || "Unnamed Chat",
                    dm: chat.dm,
                    isPrivate: chat.isPrivate,
                    passwordRequired: !!chat.password, // Assuming password_required is true if password is present
                    chatUsers: chat.chatUsers.map((chatUser) => {
                        return {
                            userId: chatUser.userId,
                            chatId: chatUser.chatId,
                            owner: chatUser.owner,
                            admin: chatUser.admin,
                            blocked: chatUser.blocked,
                            muted: chatUser.muted,
                            invited: chatUser.invited,
                        };
                    }),
                };
            });
        } catch (error) {
            console.log(`Error in getUserChats: ${error.message}`);
            throw error;
        }
    }

    /*     async getChatList(userIDtoFind: number): Promise<any> {
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
    } */

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

    async dmChatExists(userId1: number, userId2: number): Promise<AckchualChat | null> {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                dm: true,
                chatUsers: {
                    every: {
                        userId: { in: [userId1, userId2] },
                    },
                },
            },
            include: {
                chatUsers: true,
            },
        });

        return existingChat;
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

    async createDm(newChatRequest: NewChatDTO): Promise<ChatInfoDTO | null> {
        try {
            if (newChatRequest.userIds.length !== 2) {
                throw { message: "DM must have exactly 2 users" };
            }

            const existingChat: AckchualChat = await this.dmChatExists(
                newChatRequest.userIds[0],
                newChatRequest.userIds[1]
            );

            if (existingChat) {
                const existingChatInfo: ChatInfoDTO = ChatInfoDTO.fromChat(existingChat);
                return existingChatInfo;
            }

            const newChat = await this.prisma.chat.create({
                data: {
                    name: "dm-chat",
                    dm: true,
                    isPrivate: true,
                    password: null,
                },
            });

            const chatUsers: ChatUserDTO[] = [];
            for (const userId of newChatRequest.userIds) {
                const createdChatUser = await this.prisma.chat_User.create({
                    data: {
                        userId,
                        chatId: newChat.id,
                        owner: false,
                        admin: false,
                        blocked: false,
                        muted: false,
                        invited: false,
                    },
                });

                chatUsers.push({
                    userId: createdChatUser.userId,
                    chatId: createdChatUser.chatId,
                    owner: createdChatUser.owner,
                    admin: createdChatUser.admin,
                    blocked: createdChatUser.blocked,
                    muted: createdChatUser.muted,
                    invited: createdChatUser.invited,
                });
            }

            const newChatInfo: ChatInfoDTO = new ChatInfoDTO(
                newChat.id,
                newChat.name,
                newChat.dm,
                false, // private
                false, // pw not required
                chatUsers
            );

            return newChatInfo;
        } catch (error) {
            console.log(`Error in createDm: ${error.message}`);
            throw error;
        }
    }

    async getChatUsers(chatId: number): Promise<ChatUserDTO[]> {
        const chatUsers = await this.prisma.chat_User.findMany({
            where: {
                chatId,
            },
        });

        return chatUsers.map((user) => ({
            userId: user.userId,
            chatId: user.chatId,
            owner: user.owner,
            admin: user.admin,
            blocked: user.blocked,
            muted: user.muted,
            invited: user.invited,
        }));
    }

    async getChatUsers_(chatId: number): Promise<ChatUserDTO[]> {
        try {
            return await this.prisma.chat_User.findMany({
                where: {
                    chatId: Number(chatId),
                },
            });
        } catch (error) {
            console.log(`error in getChatUsers: ${error.message}`);
            throw error;
        }
    }

    async createChat(
        creatorId: number,
        newChatDTO: NewChatDTO
    ): Promise<ChatInfoDTO | Error> {
        newChatDTO.userIds.push(creatorId);

        try {
            if (newChatDTO.dm) {
                return await this.createDm(newChatDTO);
            }

            const newChat = await this.prisma.chat.create({
                data: {
                    name: "newchat",
                    dm: false,
                    password: newChatDTO.password,
                    chatUsers: {
                        createMany: {
                            data: newChatDTO.userIds.map((chatUser) => ({
                                userId: chatUser,
                            })),
                        },
                    },
                },
                include: {
                    chatUsers: true,
                },
            });

            const password_required = newChat.password !== null;
            return {
                ...newChat,
                passwordRequired: password_required,
            };
        } catch (error) {
            console.error(`Error in createChat: ${error.message}`);
            return new Error("Internal Server Error");
        }
    }
}
