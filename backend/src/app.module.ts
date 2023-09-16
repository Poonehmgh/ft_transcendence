import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import {AuthModule} from "./auth/auth.module";
import { LeaderBoardModule } from './Leaderbord/leaderboard.module';
@Module({
  imports: [UserModule, PrismaModule, AuthModule, LeaderBoardModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
