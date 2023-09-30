import { Injectable, UseInterceptors } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { diskStorage } from "multer";
import * as multer from 'multer'; // Import the multer module
import { createWriteStream } from "fs";
import { join, extname } from "path";

import {
  ERR_AVATAR_NULL,
  INFO_AVATARCHANGED,
} from "src/constants/constants.upload.service";

@Injectable()
export class UploadService {
	private upload: multer.Multer;
	
  constructor(private prisma: PrismaService) {
    const storage = diskStorage({
      destination: "./uploads/avatars", // Specify the directory where the file will be stored
      filename: (req, file, callback) => {
        const fileExtension = extname(file.originalname); // Get the original file extension
        const avatarFileName = `${Date.now()}${fileExtension}`; // Generate a unique filename
        callback(null, avatarFileName);
      },
    });

    this.upload = multer({ storage });
  }

  async storeAvatar(id: number, avatarPic: Express.Multer.File) {
    if (!avatarPic) {
      console.log("not avatarpic");
      return;
    }
    console.log(avatarPic);
    const filePath = "./upload" + id + extname(avatarPic.originalname);

    return new Promise<string>((resolve, reject) => {
      const writeStream = createWriteStream(filePath);
      avatarPic.stream.pipe(writeStream);

      writeStream.on("finish", () => {
        resolve(filePath);
      });
      writeStream.on("error", (error) => {
        reject(error);
      });
    });
  }

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
