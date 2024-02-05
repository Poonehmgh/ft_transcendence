import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChatGatewayService } from "./chat.gateway.service";
import { UserService } from "src/user/user.service";

import {
    ChatWithChatUsers,
    ChatInfoDTO,
    ChatUserDTO,
    MessageListElementDTO,
    NewChatDTO,
} from "./chat.DTOs";

@Injectable()
export class ChatService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly chatGatewayService: ChatGatewayService,
        private readonly userService: UserService
    ) {}

    // Getters

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

    async getUsersChats(userId: number): Promise<ChatInfoDTO[]> {
        try {
            const chats = await this.prisma.chat.findMany({
                where: {
                    chatUsers: {
                        some: {
                            userId: userId,
                        },
                    },
                },
                include: {
                    chatUsers: true,
                },
            });

            return chats.map((chat: ChatWithChatUsers) => {
                return {
                    id: chat.id,
                    name: chat.name || "Unnamed Chat",
                    dm: chat.dm,
                    isPrivate: chat.isPrivate,
                    passwordRequired: !!chat.password,
                    chatUsers: chat.chatUsers.map((chatUser) => {
                        return {
                            userId: chatUser.userId,
                            chatId: chatUser.chatId,
                            owner: chatUser.owner,
                            admin: chatUser.admin,
                            blocked: chatUser.blocked,
                            muted: chatUser.muted,
                            mutedUntil: chatUser.muted_until,
                            invited: chatUser.invited,
                        };
                    }),
                };
            });
        } catch (error) {
            console.error(`Error in getUsersChats: ${error.message}`);
            throw error;
        }
    }

    async getChatUsers(chatId: number): Promise<ChatUserDTO[]> {
        try {
            return await this.prisma.chat_User.findMany({
                where: {
                    chatId: Number(chatId),
                },
            });
        } catch (error) {
            console.error(`error in getChatUsers: ${error.message}`);
            throw error;
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

    // Create

    async createChat(
        creatorId: number,
        newChatDTO: NewChatDTO
    ): Promise<ChatInfoDTO | Error> {
        newChatDTO.userIds.push(creatorId);

        let chatInfo: ChatInfoDTO;

        try {
            if (newChatDTO.dm) {
                chatInfo = await this.createDmChat(creatorId, newChatDTO);
            } else {
                chatInfo = await this.createGroupChat(creatorId, newChatDTO);
            }
            this.chatGatewayService.sendChatUpdate(chatInfo.id);
            return chatInfo;
        } catch (error) {
            console.error(`Error in createChat: ${error.message}`);
            return new Error("Internal Server Error");
        }
    }

    async createDmChat(
        creatorId: number,
        newChatDto: NewChatDTO
    ): Promise<ChatInfoDTO | null> {
        try {
            if (newChatDto.userIds.length !== 2) {
                throw { message: "DM must have exactly 2 users" };
            }

            const preexistingDmChat: ChatWithChatUsers = await this.dmChatExists(
                newChatDto.userIds[0],
                newChatDto.userIds[1]
            );

            if (preexistingDmChat) {
                return ChatInfoDTO.fromChat(preexistingDmChat);
            }

            const newChat = await this.prisma.chat.create({
                data: {
                    name: "DM",
                    dm: true,
                    isPrivate: true,
                    password: null,
                    chatUsers: {
                        createMany: {
                            data: newChatDto.userIds.map((e) => ({
                                userId: e,
                                owner: false,
                                admin: false,
                                muted: false,
                                blocked: false,
                                invited: e === creatorId ? false : true,
                            })),
                        },
                    },
                },
                include: {
                    chatUsers: true,
                },
            });

            return ChatInfoDTO.fromChat(newChat);
        } catch (error) {
            console.error(`Error in createDm: ${error.message}`);
            throw error;
        }
    }

    async dmChatExists(
        userId1: number,
        userId2: number
    ): Promise<ChatWithChatUsers | null> {
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

    async createGroupChat(
        creatorId: number,
        newChatDto: NewChatDTO
    ): Promise<ChatInfoDTO | null> {
        const userNames: string[] = await Promise.all(
            newChatDto.userIds.map(async (e) => await this.userService.getNameById(e))
        );

        const firstThreeNames: string[] = userNames.slice(0, 3);
        const omittedCount: number = userNames.length - 3;

        const newChatName = `Chat with ${firstThreeNames.join(", ")}${
            omittedCount > 0 ? ` and ${omittedCount} others` : ""
        }`;

        
        const newChat = await this.prisma.chat.create({
            data: {
                name: newChatName,
                dm: false,
                isPrivate: newChatDto.isPrivate,
                password: newChatDto.password,
                chatUsers: {
                    createMany: {
                        data: newChatDto.userIds.map((e) => ({
                            userId: e,
                            owner: e === creatorId ? true : false,
                            admin: e === creatorId ? true : false,
                            muted: false,
                            blocked: false,
                            invited: e === creatorId ? false : true,
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
    }
}
