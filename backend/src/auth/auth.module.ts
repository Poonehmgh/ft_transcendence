import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import {ftStrategy} from "./strategies/ft.strategy";

@Module({
  imports: [JwtModule],
  controllers: [AuthController],
  providers: [AuthService, ftStrategy],
})
export class AuthModule {}
