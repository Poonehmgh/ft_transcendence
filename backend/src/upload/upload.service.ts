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
   
  }
}
