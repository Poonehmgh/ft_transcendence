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
import { diskStorage } from "multer";
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
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const newFilename = req.params.id + path.extname(file.originalname);
          callback(null, newFilename);
        },
      }),
      limits: {
        fileSize: 1024 * 1024 * 5,
      },
      fileFilter: (req, file, callback) => {
        const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif"];
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(fileExtension)) {
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
    console.log("get_avatar backend", id);
    const picture = `./uploads/${id}.png`;
    fs.access(picture, (error) => {
      if (error) {
        return res.sendFile("./uploads/default.jpg");
      }
      res.sendFile(picture, { root: "." });
    });
  }
}
