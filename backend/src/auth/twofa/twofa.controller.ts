import { Controller, Post, Get, UseGuards, Body, Req, Res } from '@nestjs/common';
import {TwoFactorService} from './twofa.service';
import {ftAuthGuard} from "../guards/intra_42.guard";
import {Request, Response} from "express";
import {User_42} from "../interfaces/user_42.interface";
import {TwoFaDto, TwoFaCodeDto} from "../dto/2fa.dto";
import {Public} from "../decorator/public.decorator";

@Controller('auth/twofa')
export class TwoFaController{
    constructor(private twoFAservice: TwoFactorService){}


    /*generates & saves secret code and sends back the qrUrl*/
    @Post("/generate")
    async generate2fa(@Req() request: Request, @Res() response: Response, @Body() twoFaDto: TwoFaDto ){
        const {email} = twoFaDto;
        const qrUrl = await this.twoFAservice.generate2Fa(email);
        response.status(200).json({qrUrl});
    }

    /*activates 2fa in db*/
    @Post("activate")
    @UseGuards(ftAuthGuard)
    async activate2fa(@Body() twoFaDto: TwoFaCodeDto){
        const {code, email} = twoFaDto;
        return this.twoFAservice.activate2Fa(code, email);
    }

    /*signing in with 2fa*/
    @Public()
    @Post("/authenticate2fa")
    async authenticate2fa(@Req() request: Request, @Res() response: Response, @Body() twoFaCodeDto: TwoFaCodeDto){
        const {code, email} = twoFaCodeDto;
        return this.twoFAservice.authenticate2Fa(code, email);
    }

    /*deactivate 2fa*/
    @Post("/deactivate")
    async deactivate2fa(@Body() twoFaDto: TwoFaCodeDto){
        const {code, email} = twoFaDto;
        return this.twoFAservice.deactivate2Fa(code, email);
    }






}