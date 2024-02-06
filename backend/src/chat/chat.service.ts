import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChatGatewayService } from "./chat.gateway.service";
import { UserService } from "src/user/user.service";
import { Chat_User } from "@prisma/client";

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

    async getPreexistingDmChat(
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

    async getActiveUserIds(chatId: number): Promise<number[]> {
        const chatUsers = await this.prisma.chat_User.findMany({
            where: {
                chatId: Number(chatId),
                invited: false,
                blocked: false,
            },
        });

        return chatUsers.map((e) => e.userId);
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
            //this.chatGatewayService.sendChatUpdate(chatInfo.id);
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
            console.log("creating dm chat", newChatDto);
            if (newChatDto.userIds.length !== 2) {
                throw { message: "DM must have exactly 2 users" };
            }

            const preexistingDmChat: ChatWithChatUsers = await this.getPreexistingDmChat(
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

    // Manipulate chat

    async renameChat(userId: number, chatId: number, name: string) {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chatId),
                },
                include: { chatUsers: true },
            });

            if (!chat) {
                return { error: "Chat not found" };
            }

            if (chat.chatUsers.find((e) => e.userId === userId && e.owner)) {
                await this.prisma.chat.update({
                    where: {
                        id: Number(chatId),
                    },
                    data: {
                        name,
                    },
                });
                return { message: "Chat renamed" };
            } else {
                return { error: "Must be owner to rename" };
            }
        } catch (error) {
            console.error(`Error in renameChat: ${error.message}`);
            throw error;
        }
    }

    async deleteChat(chatId: number) {
        try {
            await this.prisma.chat_User.deleteMany({
                where: {
                    chatId: Number(chatId),
                },
            });

            await this.prisma.chat.delete({
                where: {
                    id: Number(chatId),
                },
            });
            return { message: "Chat deleted" };
        } catch (error) {
            console.error(`Error in deleteChat: ${error.message}`);
            throw error;
        }
    }

    async removePassword(userId: number, chatId: number) {
        try {
            const chat = await this.prisma.chat.findUniqueOrThrow({
                where: {
                    id: Number(chatId),
                },
                include: {
                    chatUsers: true,
                },
            });

            if (chat.chatUsers.find((e) => e.userId === userId && e.owner)) {
                await this.prisma.chat.update({
                    where: {
                        id: Number(chatId),
                    },
                    data: {
                        password: null,
                    },
                });
                return { message: "Password removed" };
            } else {
                return { error: "Must be owner to remove password" };
            }
        } catch (error) {
            console.error(`Error in removePassword: ${error.message}`);
            throw error;
        }
    }

    async changePassword(userId: number, chatId: number, password: string) {
        try {
            const chat = await this.prisma.chat.findUniqueOrThrow({
                where: {
                    id: Number(chatId),
                },
                include: {
                    chatUsers: true,
                },
            });

            if (chat.chatUsers.find((e) => e.userId === userId && e.owner)) {
                await this.prisma.chat.update({
                    where: {
                        id: Number(chatId),
                    },
                    data: {
                        password,
                    },
                });
                return { message: "Password changed" };
            } else {
                return { error: "Must be owner to change password" };
            }
        } catch (error) {
            console.error(`Error in changePassword: ${error.message}`);
            throw error;
        }
    }

    // User actions

    async leaveChat(userId: number, chatId: number) {
        try {
            const chat_User = await this.prisma.chat_User.findFirstOrThrow({
                where: {
                    chatId: Number(chatId),
                    userId: Number(userId),
                },
            });

            await this.prisma.chat_User.delete({
                where: {
                    id: chat_User.id,
                },
            });

            const activeUserIds = await this.getActiveUserIds(chatId);
            if (activeUserIds.length === 0) {
                await this.deleteChat(chatId);
            }
            this.chatGatewayService.sendChatUpdate(chatId);
            return { message: "Left the chat" };
        } catch (error) {
            console.error(`Error in leaveChat: ${error.message}`);
            throw error;
        }
    }
}
