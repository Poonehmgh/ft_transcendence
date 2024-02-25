import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt'
import {ftStrategy} from "./strategies/ft.strategy";
import {jwtExpire, jwtSecret} from "../utils/constants";
import {JwtStrategy} from "./strategies/jwt.strategy";
import { TwoFactorService } from './twofa/twofa.service';
import {TwoFaController} from "./twofa/twofa.controller";
import {CryptoModule} from "./crypto/crypto.module";
@Module({
  imports: [JwtModule.register({
    secret: jwtSecret,
    signOptions: {expiresIn: "1h"},
  }), CryptoModule],
  controllers: [AuthController, TwoFaController],
  providers: [AuthService, ftStrategy, JwtStrategy, TwoFactorService],
})
export class AuthModule {}
