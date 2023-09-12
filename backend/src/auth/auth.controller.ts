import {Controller, Post, Get, Body, Req, Res, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthDto} from "./dto/auth.dto";
import {ftAuthGuard} from "./guards/intra_42.guard";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post("signup")
  signup(@Body() dto: AuthDto){
    return this.authService.signup(dto);
  }

  @Post("signin")
  signin(@Body() dto: AuthDto, @Req() req, @Res() res){
    return this.authService.signin(dto, req, res);
  }
  @Get("signout")
  signout(){
    return this.authService.signout();
  }
  @Get("/42/login")
  @UseGuards(ftAuthGuard)
  ft_oauth(){
    return this.authService.ft_oauth();
  }

  @Get("/42/redirect")
  @UseGuards(ftAuthGuard)
  ft_redirect(){
    return {msg:"pizza"}
  }

}
