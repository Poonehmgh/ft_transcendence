import {Controller, Post, Get, Body, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ftAuthGuard} from "./guards/intra_42.guard";
import {Response} from "express";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

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
    return {msg: "ewjvfw;"}
  }

  @Get("/42/redirect")
  @UseGuards(ftAuthGuard)
  async ft_redirect(@Req() req, @Res() res: Response){
    const token = await this.authService.ft_signin(req.user);
    res.cookie("token", token)
    return res.send("the login was successful!")  }

  @Get("/42/test")
  @UseGuards(JwtAuthGuard)
  test(@Req() req){
    console.log("hello from test", req.user);
    // return req.user
  }

}
