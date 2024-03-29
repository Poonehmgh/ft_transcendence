import { HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ChatGatewayService } from "./chat.gateway.service";
import { UserService } from "src/user/user.service";
import { genSaltSync, hashSync } from "bcryptjs";

import {
    Chat_ChatUser,
    ChatInfoDTO,
    ChatUserDTO,
    MessageListElementDTO,
    NewChatDTO,
    MessageDTO,
    ChatDTO,
    ExtendedChatUserDTO,
} from "./chat.DTOs";
import { Chat } from "@prisma/client";

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

            if (!chat)
                return "Chat not found";

                if (chat.dm) {
                    const otherChatUser = chat.chatUsers?.find(
                        (e) => e.userId !== userId
                    );
                
                    if (!otherChatUser)
                        return "You got ditched";
                
                    const otherUser = await this.prisma.user.findUnique({
                        where: {
                            id: otherChatUser.userId,
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

    async getPublicChats(userId: number): Promise<ChatInfoDTO[]> {
        try {
            const unjoinedPublicChats = await this.prisma.chat.findMany({
                where: {
                    isPrivate: false,
                    dm: false,
                    NOT: {
                        chatUsers: {
                            some: {
                                userId: userId,
                            },
                        },
                    },
                },
            });

            return unjoinedPublicChats.map((e: Chat) => {
                return ChatInfoDTO.fromChat(e);
            });
        } catch (error) {
            console.error(`Error in getPublicChats: ${error.message}`);
            throw error;
        }
    }

    async getUsersChats(userId: number): Promise<ChatInfoDTO[]> {
        try {
            const chats = await this.prisma.chat.findMany({
                where: {
                    AND: [
                        {
                            chatUsers: {
                                some: {
                                    userId: userId,
                                },
                            },
                        },
                        {
                            chatUsers: {
                                some: {
                                    userId: userId,
                                    banned: false,
                                },
                            },
                        },
                    ],
                },
                include: {
                    chatUsers: true,
                },
            });

            const chatInfoPromises = chats.map(async (chat: Chat_ChatUser) => {
                const chatName = await this.getChatName(chat.id, userId);
                return {
                    id: chat.id,
                    name: chatName || "Unnamed Chat",
                    dm: chat.dm,
                    isPrivate: chat.isPrivate,
                    passwordRequired: !!chat.passwordHash,
                    chatUsers: chat.chatUsers,
                };
            });

            const chatInfos = await Promise.all(chatInfoPromises);
            return chatInfos;
        } catch (error) {
            console.error(`Error in getUsersChats: ${error.message}`);
            throw error;
        }
    }

    async getLatestMessages(chatId: number) {
        try {
            const messages = await this.prisma.message.findMany({
                where: {
                    chatId: Number(chatId),
                },
                orderBy: {
                    createdAt: "desc",
                },
                take: 50,
            });

            return messages.reverse().map((message) => {
                return MessageDTO.fromMessage(message, this.userService);
            });
        } catch (error) {
            console.error(`Error in getLatestMessages: ${error.message}`);
            return new Error("Internal Server Error");
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
            console.log("Error in getMessagesbyRange:", Error);
            return {
                StatusCode: HttpStatus.BAD_REQUEST,
                message: "Error with DB",
            };
        }
    }

    async getPreexistingDmChat(
        userId1: number,
        userId2: number
    ): Promise<ChatDTO | null> {
        const existingChat = await this.prisma.chat.findFirst({
            where: {
                dm: true,
                AND: [
                    {
                        chatUsers: {
                            some: {
                                userId: userId1,
                            },
                        },
                    },
                    {
                        chatUsers: {
                            some: {
                                userId: userId2,
                            },
                        },
                    },
                ],
            },
            include: {
                chatUsers: true,
            },
        });

        if (!existingChat) {
            console.log("getPreexistingDmChat: No preexisting DM chat found");
            return null;
        }

        console.log("getPreexistingDmChat: Preexisting DM chat found");
        return ChatDTO.fromChat(existingChat);
    }

    async getActiveUserIds(chatId: number): Promise<number[]> {
        const chatUsers = await this.prisma.chat_User.findMany({
            where: {
                chatId: Number(chatId),
                banned: false,
            },
        });

        return chatUsers.map((e) => e.userId);
    }

    async getCompleteChat(chatId: number, userId: number): Promise<ChatDTO | Error> {
        try {
            const chat = await this.prisma.chat.findUnique({
                where: {
                    id: Number(chatId),
                },
                include: {
                    chatUsers: true,
                    messages: {
                        orderBy: {
                            createdAt: "desc",
                        },
                        take: 50,
                    },
                },
            });

            if (!chat.chatUsers.some((e) => e.userId === userId))
                return new Error("User is not part of this chat");

            if (!chat) {
                return new Error("Chat not found");
            }

            const extendedChatUsersPromises = chat.chatUsers.map((chatUser) => {
                return ExtendedChatUserDTO.fromChatUser(chatUser, this.userService);
            });

            const extendedChatUsers = await Promise.all(extendedChatUsersPromises);
            const dynamicChatName = await this.getChatName(chatId, userId);

            const resolvedMessages = await Promise.all(
                chat.messages.reverse().map((message) => MessageDTO.fromMessage(message, this.userService))
            );

            return {
                id: chat.id,
                name: dynamicChatName,
                dm: chat.dm,
                isPrivate: chat.isPrivate,
                passwordRequired: !!chat.passwordHash,
                chatUsers: extendedChatUsers,
                messages: resolvedMessages
                }
            }
         catch (error) {
            console.error(`Error in getCompleteChat: ${error.message}`);
            return new Error("Internal Server Error");
        }
    }

    // Create

    async createChat(
        creatorId: number,
        newChatDTO: NewChatDTO
    ): Promise<ChatInfoDTO | Error> {
        console.log("createChat called");
        newChatDTO.userIds.push(creatorId);

        let chatInfo: ChatInfoDTO;

        try {
            if (newChatDTO.dm) {
                chatInfo = await this.createDmChat(creatorId, newChatDTO);
            } else {
                chatInfo = await this.createGroupChat(creatorId, newChatDTO);
            }
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
        console.log("creatDmChat called for users:", newChatDto.userIds);
        try {
            if (newChatDto.userIds.length !== 2) {
                throw { message: "DM must have exactly 2 users" };
            }

            const preexistingDmChat: ChatDTO = await this.getPreexistingDmChat(
                newChatDto.userIds[0],
                newChatDto.userIds[1]
            );

            if (preexistingDmChat) {
                return ChatInfoDTO.fromChatDTO(preexistingDmChat);
            }

            const newChat = await this.prisma.chat.create({
                data: {
                    name: "DM",
                    dm: true,
                    isPrivate: true,
                    passwordHash: null,
                    chatUsers: {
                        createMany: {
                            data: newChatDto.userIds.map((e) => ({
                                userId: e,
                                owner: false,
                                admin: false,
                                muted: false,
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
        console.log("createGroupChat called for users:", newChatDto.userIds);

        const userNames: string[] = await Promise.all(
            newChatDto.userIds.map(async (e) => await this.userService.getNameById(e))
        );
        const firstThreeNames: string[] = userNames.slice(0, 3);
        const omittedCount: number = userNames.length - 3;

        if (newChatDto.password) {
            newChatDto.password = hashSync(newChatDto.password, 12);
        }

        const newChatName = `Chat with ${firstThreeNames.join(", ")}${
            omittedCount > 0 ? ` and ${omittedCount} more` : ""
        }`;

        const newChat = await this.prisma.chat.create({
            data: {
                name: newChatName,
                dm: false,
                isPrivate: newChatDto.isPrivate,
                passwordHash: newChatDto.password,
                chatUsers: {
                    createMany: {
                        data: newChatDto.userIds.map((e) => ({
                            userId: e,
                            owner: e === creatorId ? true : false,
                            admin: e === creatorId ? true : false,
                            muted: false,
                        })),
                    },
                },
            },
            include: {
                chatUsers: true,
            },
        });

        const passwordRequired = newChat.passwordHash !== null;

        return {
            ...newChat,
            passwordRequired: passwordRequired,
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

            await this.prisma.message.deleteMany({
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
                        passwordHash: null,
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
        console.log("changePassword called");
        try {
            let salt: string = null;

            const chat = await this.prisma.chat.findUniqueOrThrow({
                where: {
                    id: Number(chatId),
                },
                include: {
                    chatUsers: true,
                },
            });

            const newPasswordHash = hashSync(password, 12);

            if (chat.chatUsers.find((e) => e.userId === userId && e.owner)) {
                await this.prisma.chat.update({
                    where: {
                        id: Number(chatId),
                    },
                    data: {
                        passwordHash: newPasswordHash,
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

            /*
            Maybe have this. But if, then should only delete private chats.
            Public chats should only be actively deleted by the owner.
           
            const activeUserIds = await this.getActiveUserIds(chatId);
            if (activeUserIds.length === 0) {
                await this.deleteChat(chatId);
            }
            */
            return { message: "Left the chat" };
        } catch (error) {
            console.error(`Error in leaveChat: ${error.message}`);
            throw error;
        }
    }
}
