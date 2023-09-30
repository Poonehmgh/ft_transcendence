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
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import * as multer from "multer";
import { extname } from "path";
import { Response } from 'express';

import { UploadService } from "./upload.service";

import * as fs from "fs";
import { PrismaService } from "src/prisma/prisma.service";
import { ERR_INVALFILETYPE } from "src/constants/constants.upload.service";

const intercept_avatar = {
  fieldName: "avatar",
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./upload/");
    },
    filename: function (req, file, cb) {
      cb(null, `avatar-${req.body.thisId}`);
    },
  }),
  fileFilter: function (req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      cb(new Error(ERR_INVALFILETYPE), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./upload/");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.body.thisId}${extname(file.originalname)}`);
  },
});

@Controller("upload")
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post("put_avatar")
  @UseInterceptors(FileInterceptor(intercept_avatar.fieldName, intercept_avatar))
  async putAvatar(
    @UploadedFile() avatar: Express.Multer.File,
    @Body() body: { thisId: number }
  ) {
    const { thisId } = body;
    return this.uploadService.putAvatar(thisId, avatar);
  }

  @Get("get_avatar/:id")
  async getMyAvatar(@Param('id') id: number, @Res() res: Response) {
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

/* 
@Controller("pictures")
export class PicturesController {
  constructor() {}

  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: "./uploads/profile_pictures",
        filename: (req: any, file, cb) => {
          const file_name = req.user.id;
          return cb(null, `${file_name}${extname(file.originalname)}`);
        },
      }),
    })
  )
  async upload_picture(
    @Body() _body,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 300000 }),
          new FileTypeValidator({ fileType: ".(jpeg)" }),
        ],
      })
    )
    file,
    @Req() _req: any
  ) {
    if (file != undefined) {
      return;
    }
  }

  @Get("me")
  async get_my_picture(@Res() _res, @Req() _req: any): Promise<any> {
    const picture = `./uploads/profile_pictures/${_req.user.id}.jpeg`;
    await fs.access(picture, (error) => {
      if (error) {
        return _res.sendFile("default_picture.jpeg", {
          root: "./uploads/profile_pictures",
        });
      }
      _res.sendFile(picture, { root: "." });
    });
  }

  @Get("group_chat")
  async get_group_chat(@Param("userId") userId, @Res() _res: any): Promise<any> {
    return _res.sendFile("group_chat_picture.jpeg", {
      root: "./uploads/profile_pictures",
    });
  }

  @Get(":userId")
  async get_my_picture_by_id(@Param("userId") userId, @Res() _res: any): Promise<any> {
    const picture = `./uploads/profile_pictures/${userId}.jpeg`;
    await fs.access(picture, (error) => {
      if (error) {
        return _res.sendFile("default_picture.jpeg", {
          root: "./uploads/profile_pictures",
        });
      }
      _res.sendFile(picture, { root: "." });
    });
  }
}
 */
