/*Express*/
import {Request, Response} from "express";

/*Nest*/
import { Controller, Post, Get, UseGuards, Body, Req, Res } from '@nestjs/common';

/*Services*/
import {TwoFactorService} from './twofa.service';

/*Guards*/
import {ftAuthGuard} from "../guards/intra_42.guard";
import {JwtAuthGuard} from "../guards/jwt-auth.guard";

/*Interface*/
import {User_42} from "../interfaces/user_42.interface";


/*DTOs*/
import {TwoFaDto, TwoFaCodeDto, TwoFaCodeDto2} from "../dto/2fa.dto";

/*Decorators*/
import {Public} from "../decorator/public.decorator";




@Controller('auth/twofa')
export class TwoFaController{
    constructor(private twoFAservice: TwoFactorService){}


    /*generates & saves secret code and sends back the qrUrl*/
    @Post("/generate")
    @UseGuards(JwtAuthGuard)
    async generate2fa(@Req() request: Request, @Res() response: Response){
        const user = request.user as User_42
        const {url} = await this.twoFAservice.generate2Fa(user.email);
        response.json({url});
    }

    /*activates 2fa in db-> when QR code, comes here*/
    @Post("activate")
    @UseGuards(JwtAuthGuard)
    async activate2fa(@Req() request:Request,@Body() twoFaDto: TwoFaCodeDto){
        const {code} = twoFaDto;
        const user = request.user as User_42;
        return this.twoFAservice.activate2Fa(code, user.email);
    }

    /*signing in with 2fa*/
    @Post("/authenticate2fa")
    async authenticate2fa(@Req() request: Request, @Res() response: Response, @Body() twoFaCodeDto: TwoFaCodeDto2){
        const {code, email} = twoFaCodeDto;
        return this.twoFAservice.authenticate2Fa(code, email, response);
    }

    //
    /*deactivate 2fa*/
    @Post("/deactivate")
    @UseGuards(JwtAuthGuard)
    async deactivate2fa(@Req() request: Request, @Body() twoFaDto: TwoFaCodeDto2){
        const {code} = twoFaDto;
        const user = request.user as User_42;
        return ({"hello":code});
        return this.twoFAservice.deactivate2Fa(code, user.email);
    }

    @Get("/state")
    @UseGuards(JwtAuthGuard)
    async get2faState(@Req() request: Request){
        const {email} = request.user as User_42;
        return this.twoFAservice.get2faState(email);
    }

}