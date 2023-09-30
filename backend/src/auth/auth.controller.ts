import {Controller, Post, Get, Body, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ftAuthGuard} from "./guards/intra_42.guard";
import {Response} from "express";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {TwoFaDto} from "./dto/2fa.dto";
import {TwoFaCodeDto} from "./dto/2fa.dto";

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
  ftOauth(){
    // return this.authService.ft_oauth();
    console.log("controller at login is called.")
    return {"msg": "this is returned when something is wrong with the guards.;"}
  }

  @Get("/42/redirect")
  @UseGuards(ftAuthGuard)
  async ftRedirect(@Req() req, @Res() res: Response){
    const token = await this.authService.ftSignin(req.user);
    res.cookie("token", token)
    console.log("controller at redirect is called.")

    // return res.send("the login was successful!")
    return res.json({"msg": "the login was successful!"});
  }

  @Get("/42/test")
  @UseGuards(JwtAuthGuard)
  async test(@Req() req){
    console.log("hello from test", req.user);
    return req.user
  }

  @Post("2fa_activate")
  @UseGuards(JwtAuthGuard)
  async activate(@Body() twoFaDto: TwoFaDto){
    return this.authService.activate(twoFaDto);
  }

  @Post("/42/logout")
  @UseGuards(JwtAuthGuard)
  async ft_logout(@Req() req, @Res() res: Response){
    res.clearCookie("token");
    return res.json({"msg": "the logout was successful!"});
  }

  @Get("42/2fa_login")
  @UseGuards(JwtAuthGuard)
    async ft2FaLogin_FirstStep(@Req() req, @Res() res: Response){
      const {qrCode, url} = await this.authService.ft2FaLogin_FirstStep(req.user);
      res.cookie("qrCode", qrCode);
      res.cookie("url", url);
      return res.json({"msg": "QR code is generated."});
    }


  @Get("42/2fa_login/redirect")
  @UseGuards(JwtAuthGuard)
  async validate2FaCode(@Req() req, @Res() res: Response, @Body() twoFaCodeDto: TwoFaCodeDto){
    const token = await this.authService.validate2FaCode(twoFaCodeDto);
    res.cookie("token", token);
    return res.json({"msg": "the login was successful!"});
  }

}
