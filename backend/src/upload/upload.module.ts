import { Module } from "@nestjs/common";
import { UploadService } from "./upload.service";
import { UploadController } from "./upload.controller";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
  providers: [UploadService, PrismaService],
  controllers: [UploadController],
})
export class UploadModule {}
