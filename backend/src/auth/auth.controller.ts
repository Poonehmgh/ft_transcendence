/*Express*/
import {Response, Request} from "express";

/*Nest*/
import {Controller, Post, Get, Body, Req, Res, UseGuards, UnauthorizedException} from '@nestjs/common';

/*Services*/
import { AuthService } from './auth.service';
import {TwoFactorService} from './twofa/twofa.service';

/*Guards*/
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {ftAuthGuard} from "./guards/intra_42.guard";

/*Decorator*/
import {Public} from "./decorator/public.decorator";

/*Interface*/
import {User_42} from "./interfaces/user_42.interface"
import { User } from '@prisma/client';
import {CryptoService} from "./crypto/crypto.service";

@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly twofaService: TwoFactorService,
      private readonly cryptoService: CryptoService) {}


  @Public()
  @Get("/42/login")
  @UseGuards(ftAuthGuard)
  ftOAuth(){
  }

  @Public()
  @Get("/42/redirect")
  @UseGuards(ftAuthGuard)
  async ftRedirect(@Req() req: Request, @Res() res: Response) {

    const user: User = await this.authService.signin(req.user as User_42);

    const {email, twoFa} = user;
    return twoFa ? this.twofaService.signin2Fa(res, user)
        : this.authService.signin_token(res, user);
  }


  @Get("/42/test")
  @UseGuards(JwtAuthGuard)
  async test(@Req() req){
    console.log("hello from test", req.user);
    const temp = "something for encyption";
    const encrypted:string = this.cryptoService.encrypt(temp);
    console.log("encrypted", encrypted);
    const decrypted:string = this.cryptoService.decrypt(encrypted);
    console.log("decrypted", decrypted);
    return req.user
  }


  @Post("42/logout")
  @UseGuards(JwtAuthGuard)
  async ft_logout(@Req() req, @Res() res: Response){
    res.clearCookie("token");
    return res.json({"msg": "the logout was successful!"});
  }

  @Post("refresh_token")
    async refresh_token(@Req() req, @Res() response: Response){
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken)
            throw new UnauthorizedException("No refresh token found.");

       try{

         const userData = await this.authService.validateRefreshToken(refreshToken);
         const newAccessToken = await this.authService.generateJwtToken(userData);
         const newRefreshToken = await this.authService.generateRefreshToken(userData);

         response.cookie("token", newAccessToken);
         response.cookie("refreshToken", newRefreshToken, { httpOnly: true });
       } catch (e) {
            throw new UnauthorizedException("Invalid refresh token.");
       }
  }

}
