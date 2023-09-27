import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  FriendListDTO,
  SocialStatus,
  IdAndNameDTO,
  NewUserDTO,
  ScoreCardDTO,
  UserProfileDTO,
} from "./user-dto";
import { User } from "@prisma/client";
import {
  ERR_ACCEPT_FREQ,
  ERR_ALRDY_BLOCKED,
  ERR_DECL_FREQ,
  ERR_NOT_BLOCKED,
  ERR_NO_FREQ,
  INFO_ACCEPT_FREQ,
  INFO_BLOCK,
  INFO_BLOCK_CANCEL,
  INFO_BLOCK_RM,
  INFO_DECL_FREQ,
  INFO_FREQ_CANCEL,
  INFO_RM,
  INFO_SEND_FREQ,
  INFO_UNBLOCK,
} from "src/constants/constants.user.service";

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(userData) {
    return this.prisma.user.create({ data: userData });
  }

  async newUser(userData: NewUserDTO): Promise<void> {
    await this.prisma.user.create({ data: userData });
  }

  async getAllUsers(): Promise<IdAndNameDTO[]> {
    const users = await this.prisma.user.findMany({
      select: { id: true, name: true },
    });
    if (users.length === 0) return [];

    return users.map(({ id, name }) => {
      return new IdAndNameDTO(id, name);
    });
  }

  async getScoreCard(userId: number): Promise<ScoreCardDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        rank: true,
        matches: true,
        mmr: true,
        winrate: true,
      },
    });
    if (!user) throw new Error("getScoreCard: User not found");

    return {
      id: user.id,
      name: user.name,
      rank: user.rank,
      matches: user.matches.length,
      winrate: user.winrate,
      mmr: user.mmr,
    };
  }

  async getMatches(userId: number): Promise<number[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { matches: true },
    });
    if (!user) throw new Error("getMatches: User not found");
    return user.matches;
  }

  async getProfile(userId: number): Promise<UserProfileDTO> {
    const profile = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        id: true,
        name: true,
        avatarURL: true,
        rank: true,
        mmr: true,
        matches: true,
        winrate: true,
        online: true,
      },
    });
    if (!profile) throw new Error("getProfile: User not found");
    return {
      id: profile.id,
      name: profile.name,
      avatarURL: profile.avatarURL,
      rank: profile.rank,
      mmr: profile.mmr,
      matches: profile.matches.length,
      winrate: profile.winrate,
      online: profile.online,
    };
  }

  async getFriendStatus(userId: number, otherUserId: number): Promise<SocialStatus> {
    const user = await this.prisma.user.findUnique({
      where: { id: Number(userId) },
      select: {
        friends: true,
        friendReq_out: true,
        friendReq_in: true,
        blocked: true,
      },
    });
    if (!user) throw new Error("getFriendStatus");

    if (user.friends.includes(Number(otherUserId))) return SocialStatus.friends;
    if (user.friendReq_out.includes(Number(otherUserId)))
      return SocialStatus.request_sent;
    if (user.friendReq_in.includes(Number(otherUserId)))
      return SocialStatus.request_received;
    if (user.blocked.includes(Number(otherUserId))) return SocialStatus.blocked;
    return SocialStatus.none;
  }

  async getFriends(userId: number): Promise<IdAndNameDTO[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friends: true },
    });
    if (!user) throw new Error("getFriends");
    const friends = await this.prisma.user.findMany({
      where: {
        id: { in: user.friends },
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (friends.length === 0) return [];
    return friends.map(({ id, name }) => {
      return new IdAndNameDTO(id, name);
    });
  }

  async getOnlineFriends(userId: number): Promise<IdAndNameDTO[]> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { friends: true },
    });
    if (!user) throw new Error("getOnlineFriends");

    const onlineFriends = await this.prisma.user.findMany({
      where: {
        id: { in: user.friends },
        online: true,
      },
      select: {
        id: true,
        name: true,
      },
    });
    if (onlineFriends.length === 0) return [];
    return onlineFriends.map(({ id, name }) => {
      return new IdAndNameDTO(id, name);
    });
  }

  async getFriendsData(userId: number): Promise<FriendListDTO> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        friends: true,
        friendReq_out: true,
        friendReq_in: true,
        blocked: true,
      },
    });
    if (!user) throw new Error("getFriendsData: User not found");

    return {
      friends: user.friends,
      friendReq_out: user.friendReq_out,
      friendReq_in: user.friendReq_in,
      blocked: user.blocked,
    };
  }
  //TODO try throw these instead of if(!) all functions!
  async getTopScoreCards(n: number): Promise<ScoreCardDTO[]> {
    const topUsers: User[] = await this.prisma.user.findMany({
      where: { matches: { isEmpty: false } },
      orderBy: { mmr: "desc" },
      take: Number(n),
    });

    return topUsers.map(({ id, name, rank, matches, mmr, winrate }) => {
      return new ScoreCardDTO(id, name, rank, mmr, matches.length, winrate);
    });
  }

  // Getters

  async getUserById(userId: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error(`User with ID ${userId} not found`);
    }

    return user;
  }

  // Friend management

  // TODO: when localstorage: update userId
  async sendFriendReq(otherId: number) {
    const thisId = 1;
    try {
      const [thisUser, otherUser] = await Promise.all([
        this.getUserById(thisId),
        this.getUserById(otherId),
      ]);
      if (thisUser.friendReq_in.includes(otherId)) {
        return this.acceptFriendReq(otherId);
      }
      await Promise.all([
        this.updateArray(thisId, "friendReq_out", [...thisUser.friendReq_out, otherId]),
        this.updateArray(otherId, "friendReq_in", [...otherUser.friendReq_in, thisId]),
      ]);
      return INFO_SEND_FREQ;
    } catch (error) {
      console.log(error);
      return error.msg;
    }
  }

  async cancelFriendReq(otherId: number) {
    const thisId = 1;
    try {
      await Promise.all([
        this.delFromArray(thisId, "friendReq_out", otherId),
        this.delFromArray(otherId, "friendReq_in", thisId),
      ]);
      return INFO_FREQ_CANCEL;
    } catch (error) {
      console.log(error);
      return error.msg;
    }
  }

  async acceptFriendReq(otherId: number) {
    const thisId = 1;
    try {
      const [thisUser, otherUser] = await Promise.all([
        this.getUserById(thisId),
        this.getUserById(otherId),
      ]);
      if (!thisUser.friendReq_in.includes(otherId)) {
        throw new Error(ERR_NO_FREQ);
      }
      await Promise.all([
        this.delFromArray(thisId, "friendReq_in", otherId),
        this.delFromArray(thisId, "friendReq_out", otherId),
        this.updateArray(thisId, "friends", [...thisUser.friends, otherId]),
        this.delFromArray(otherId, "friendReq_out", thisId),
        this.delFromArray(otherId, "friendReq_in", thisId),
        this.updateArray(otherId, "friends", [...otherUser.friends, thisId]),
      ]);
      return INFO_ACCEPT_FREQ;
    } catch (error) {
      console.log(error);
      return ERR_ACCEPT_FREQ;
    }
  }

  async declineFriendReq(otherId: number) {
    const thisId = 1;
    try {
      await Promise.all([
        this.delFromArray(thisId, "friendReq_in", otherId),
        this.delFromArray(otherId, "friendReq_out", thisId),
      ]);
      return INFO_DECL_FREQ;
    } catch (error) {
      console.log(error);
      return ERR_DECL_FREQ;
    }
  }

  async removeFriend(otherId: number) {
    const thisId = 1;
    try {
      this.delFromArray(thisId, "friends", otherId);
      this.delFromArray(otherId, "friends", thisId);
      return INFO_RM;
    } catch (error) {
      console.log(error);
      return error.msg;
    }
  }

  async blockUser(otherId: number) {
    const thisId = 1;
    try {
      const thisUser = await this.getUserById(thisId);
      if (thisUser.blocked.includes(otherId)) {
        throw new Error(ERR_ALRDY_BLOCKED);
      }
      let msg: string = INFO_BLOCK;
      if (thisUser.friends.includes(otherId)) {
        this.removeFriend(otherId);
        msg = INFO_BLOCK_RM;
      } else if (thisUser.friendReq_out.includes(otherId)) {
        this.cancelFriendReq(otherId);
        msg = INFO_BLOCK_CANCEL;
      }
      this.updateArray(thisId, "blocked", [...thisUser.blocked, otherId]);
      return msg;
    } catch (error) {
      console.log(error);
      return error.msg;
    }
  }

  async unblockUser(otherId: number) {
    const thisId = 1;
    try {
      this.delFromArray(thisId, "blocked", otherId);
      return INFO_UNBLOCK;
    } catch (error) {
      console.log(error);
      return error.msg;
    }
  }

  // meta functions
  // maybe externalize later (how to add prisma best then?)

  async updateArray(userId: number, field: string, newArray: number[]) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          friends: {
            set: newArray,
          },
        },
      });
    } catch (error) {
      console.log(error.msg);
    }
  }

  async delFromArray(userId: number, field: string, valueToDelete: number) {
    try {
      return await this.prisma.user.update({
        where: { id: userId },
        data: {
          [field]: {
            set: {
              filter: {
                NOT: {
                  equals: valueToDelete,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.log(error.msg);
    }
  }
}
