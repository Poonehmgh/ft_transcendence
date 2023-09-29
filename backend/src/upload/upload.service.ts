import { Injectable, UseInterceptors } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { extname } from "path";
import {
  ERR_AVATAR_NULL,
  INFO_AVATARCHANGED,
} from "src/constants/constants.upload.service";

@Injectable()
export class UploadService {
  constructor(private prisma: PrismaService) {}

  async putAvatar(thisId: number, avatar: Express.Multer.File) {
    if (!avatar) return ERR_AVATAR_NULL;
    try {
      await this.prisma.user.update({
        where: { id: thisId },
        data: {
          avatarURL: `${thisId}`,
        },
      });
      return INFO_AVATARCHANGED;
    } catch (error) {
      console.log(error);
      return ERR_AVATAR_NULL;
    }
  }
}
