import {Controller, Post, Get, Body, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ftAuthGuard} from "./guards/intra_42.guard";
import {Response} from "express";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import {TwoFaDto} from "./dto/2fa.dto";

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
  ft_oauth(){
    // return this.authService.ft_oauth();
    console.log("controller at login is called.")
    return {"msg": "this is returned when something is wrong with the guards.;"}
  }

  @Get("/42/redirect")
  @UseGuards(ftAuthGuard)
  async ft_redirect(@Req() req, @Res() res: Response){
    const token = await this.authService.ft_signin(req.user);
    res.cookie("token", token)
    console.log("controller at redirect is called.")

    // return res.send("the login was successful!")
    return res.json({"msg": "the login was successful!"});
    // add the redirection to a certain page here later
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


}
