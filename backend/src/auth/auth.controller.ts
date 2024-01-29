import {Controller, Post, Get, Body, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ftAuthGuard} from "./guards/intra_42.guard";
import {Response, Request} from "express";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {TwoFaDto} from "./dto/2fa.dto";
import {TwoFaCodeDto} from "./dto/2fa.dto";
import * as cookieParser from "cookie-parser"; // for testing the cookies in the request object
import {signInReturn} from "./auth.service";
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // @Post("signup")
  // signup(@Body() dto: AuthDto){
  //   return this.authService.signup(dto);
  // }

  // @Post("signin")
  // signin(@Body() dto: AuthDto, @Req() req, @Res() res){
  //   return this.authService.signin(dto, req, res);
  // }
  // @Get("signout")
  // signout(){
  //   return this.authService.signout();
  // }
  @Get("/42/login")
  @UseGuards(ftAuthGuard)
  ftOAuth(){
    return {"msg": "this is returned when something is wrong with the guards.;"}
  }

  @Get("/42/redirect")
  @UseGuards(ftAuthGuard)
  async ftRedirect(@Req() req, @Res() res: Response){
    const { qrcode, url, newToken}: signInReturn = await this.authService.ftSignin(req.user);
    if (qrcode != undefined) // for some reason this isnt sent back to browser.
      res.cookie("qrCode", qrcode);
    if (url != undefined)
      res.cookie("url", url);
    res.cookie("token", newToken);
    res.json("Return");
    // res.redirect("/");
  }

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
    const { qrcode, url, newToken} = await this.authService.activate2Fa(req.user);
    res.cookie("qrCode", qrcode);
    res.cookie("url", url);
    res.cookie("token", newToken);

    return res.json({"msg:": "the QR code for 2fa activation is provided. One more step to have 2fa is remained.", "token": newToken});
  }

  @Post("42/verify2fa")
  @UseGuards(JwtAuthGuard)
  async verify2Fa(@Req() req, @Res() res: Response, @Body() twoFaDto: TwoFaCodeDto)
  {
    const newToken = await this.authService.verify2Fa(twoFaDto, req.user);
    res.cookie("token", newToken);
    return res.json({"msg": "Verification successful.", "token": newToken});
  }

  @Get("42/logout") //should be post, but for sake of browser test
  @UseGuards(JwtAuthGuard)
  async ft_logout(@Req() req, @Res() res: Response){
    res.clearCookie("token");
    return res.json({"msg": "the logout was successful!"});
  }

}
