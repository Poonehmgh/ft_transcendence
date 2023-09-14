import { Module } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import { LeaderBoardController } from './leaderboard.controller';
import { LeaderBoardService } from './leaderboard.service';

@Module({
	controllers: [LeaderBoardController],
	providers: [LeaderBoardService, PrismaService]
})
export class LeaderBoardModule {}
