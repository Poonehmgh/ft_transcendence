import {
  Controller,
  UseGuards,
  Post,
  Get,
  UseInterceptors,
  Body,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Req,
  Res,
  Param,
  ParseFilePipeBuilder,
  HttpStatus,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import * as path from "path";
import { Response } from "express";

import { UploadService } from "./upload.service";

import * as fs from "fs";
import { PrismaService } from "src/prisma/prisma.service";
import { ERR_INVALFILETYPE } from "src/constants/constants.upload.service";

@Controller("uploads")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("put_avatar/:id")
  @UseInterceptors(
    FileInterceptor("avatar", {
      dest: "./uploads",
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, callback) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const fileExtension = path.extname(file.originalname);

        if (allowedExtensions.includes(fileExtension.toLowerCase())) {
          callback(null, true);
        } else {
          return callback(
            new BadRequestException("Only JPG, JPEG, PNG, and GIF files are allowed"),
            false
          );
        }
      },
    })
  )
  async uploadFile(@Param("id") id: number, @UploadedFile() file: Express.Multer.File) {
    return { message: "File uploaded successfully", file };
  }

  @Get("get_avatar/:id")
  async getMyAvatar(@Param("id") id: number, @Res() res: Response) {
    console.log("get_avater backend", id);
    const picture = `./uploads/profile_pictures/${id}.jpeg`;
    fs.access(picture, (error) => {
      if (error) {
        return res.sendFile("default.jpeg", {
          root: "./upload/",
        });
      }
      res.sendFile(picture, { root: "." });
    });
  }
}
