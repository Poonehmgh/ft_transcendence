import {Controller, Post, Get, Body, Req, Res, UseGuards, Logger} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ftAuthGuard} from "./guards/intra_42.guard";
import {Response, Request} from "express";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {TwoFaDto} from "./dto/2fa.dto";
import {TwoFaCodeDto} from "./dto/2fa.dto";
import * as cookieParser from "cookie-parser"; // for testing the cookies in the request object
import {signInReturn} from "./auth.service";
import {Public} from "./decorator/public.decorator";
import {User_42} from "./interfaces/user_42.interface"
import { User } from '@prisma/client';
import {TwoFactorService} from './twofa/twofa.service';


@Controller('auth')
export class AuthController {
  constructor(
      private readonly authService: AuthService,
      private readonly twofaService: TwoFactorService) {}


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




    //   if (url != undefined)
  //     res.cookie("url", url);
  //   res.cookie("token", newToken, {
  //     // httpOnly: true,
  //     // sameSite: 'strict',
  //   });
  //   if (req.user.twoFa)
  //     res.redirect("http://localhost:3000/2fa")
  //   else
  //     res.redirect("http://localhost:3000/home");
  // }

  @Get("/42/test")
  @UseGuards(JwtAuthGuard)
  async test(@Req() req){
    console.log("hello from test", req.user);
    return req.user
  }

  @Post("42/2fa")
  @UseGuards(JwtAuthGuard)
  async activate2Fa(@Req() req, @Res() res:Response)
  {
    const {url, newToken} = await this.authService.activate2Fa(req.user);
    res.cookie("url", url);
    res.cookie("token", newToken, {
      // httpOnly: true,
      // sameSite: 'strict',
    });

    return res.json({"msg:": "the QR code for 2fa activation is provided. One more step to have 2fa is remained.", "token": newToken});
  }

  @Post("42/verify2fa")
  @UseGuards(JwtAuthGuard)
  async verify2Fa(@Req() req, @Res() res: Response, @Body() twoFaDto: TwoFaCodeDto)
  {
    const newToken = await this.authService.verify2Fa(twoFaDto, req.user);
    res.cookie("token", newToken, {
      // httpOnly: true,
      // sameSite: 'strict',
    });
    return res.json({"msg": "Verification successful.", "token": newToken});
  }

  @Post("42/logout")
  @UseGuards(JwtAuthGuard)
  async ft_logout(@Req() req, @Res() res: Response){
    res.clearCookie("token");
    return res.json({"msg": "the logout was successful!"});
  }

  @Post("42/deactivate2fa")
  @UseGuards(JwtAuthGuard)
  async deactivate2fa(@Req() req, @Res() res: Response, @Body() twoFaDto: TwoFaCodeDto)
  {
    const newToken = await this.authService.deactivate2fa(twoFaDto, req.user);
    res.cookie("token", newToken, {
      // httpOnly: true,
      // sameSite: 'strict',
    });
    res.redirect("http://localhost:3000");
  }

}
