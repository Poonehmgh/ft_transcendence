import {
  Controller,
  UseGuards,
  Post,
  Get,
  UseInterceptors,
  Body,
  UploadedFile,
  Req,
  Res,
  Param,
  BadRequestException,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import * as path from "path";
import * as fs from "fs";
import { Response } from "express";
import { UploadService } from "./upload.service";

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
    const directory = "/backend/uploads";

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error("Error reading directory:", err);
        return res.status(500).send("Error reading uploads directory");
      }

      const matchingFile = files.find(
        (file) => path.basename(file, path.extname(file)) === String(id)
      );

      if (!matchingFile) {
        console.log("sending default profile pic backend", id);
        return res.sendFile("default.jpg", { root: "./uploads" });
      }

      const filePath = path.join(directory, matchingFile);
      res.sendFile(filePath);
    });
  }
}
