import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import {ftStrategy} from "./strategies/ft.strategy";
import {jwtSecret} from "../utils/constants";
import {JwtStrategy} from "./strategies/jwt.strategy";


@Module({
  imports: [JwtModule.register({
    secret: jwtSecret,
    signOptions: {expiresIn: "1h"},
  })],
  controllers: [AuthController],
  providers: [AuthService, ftStrategy, JwtStrategy],
})
export class AuthModule {}
