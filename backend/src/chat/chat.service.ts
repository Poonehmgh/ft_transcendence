import {HttpStatus, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {ChatListDTO, MessageListElementDTO, ParticipantListElementDTO} from "./chat.DTOs";

@Injectable()
export class ChatService {
    constructor(private readonly prisma: PrismaService) {
    }

    async getChatList(userIDtoFind: number): Promise<any> {
        try {
            const chatsWithUser = await this.prisma.chat.findMany({
                where: {
                    chatUsers: {
                        some: {
                            userId: Number(userIDtoFind)
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
                message: "Error with DB"
            }
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
                        createdAt: 'desc',
                    },
                    take: 50,
                } as any);
                return messages.map((message) => {
                    return new MessageListElementDTO(message.id, message.content, message.author);
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
                    return new MessageListElementDTO(message.id, message.content, message.author);
                });
            }
        } catch {
            return {
                StatusCode: HttpStatus.BAD_REQUEST,
                message: "Error with DB"
            }
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

            const participants: ParticipantListElementDTO[] = chatUsers.map((chatUser) => {
                const user = chatUser.user;

                return new ParticipantListElementDTO(
                    user ? user.name : '',
                    user ? user.id : 0,
                    chatUser.owner,
                    chatUser.admin,
                    user ? user.online : false
                );
            });

            return participants;
        } catch {
            return {
                StatusCode: HttpStatus.BAD_REQUEST,
                message: "Error with DB"
            }
        }
    }


}
