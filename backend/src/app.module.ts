import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import {AuthModule} from "./auth/auth.module";
import {GameGatewayModule} from "./game/game.gateway.module";
import {UserController} from "./user/user.controller";
import {UserService} from "./user/user.service";
import {TwoFaModule} from "./twofa/twofa.module";

@Module({
  imports: [UserModule, PrismaModule, AuthModule, GameGatewayModule, TwoFaModule],
  controllers: [AppController, UserController],
  providers: [AppService, PrismaService, UserService],
})

export class AppModule {}
