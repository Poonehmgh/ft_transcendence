
/*Express*/
import { Request, Response } from 'express';

/*Nest*/
import { forwardRef, Inject, Injectable, UnauthorizedException, BadRequestException,} from '@nestjs/common';

/*Prisma*/
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';

/*Services*/
import { AuthService } from '../auth.service';

/**OTPLIB */
import {authenticator} from "otplib";

@Injectable()
export class TwoFactorService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => AuthService)) /* By using forwardRef, you're deferring the resolution of AuthService until runtime, allowing the circular dependency to be resolved properly.*/
        private authservice: AuthService,
    ){}

    /*redirect 2fa enabled sign in */
    signin2Fa(response: Response, user: User) {
        const apiUrl = process.env.FRONTEND_URL + "/auth"
        response.cookie("user", user);
        response.redirect(apiUrl);
        return response;
    }

    /*generates secret code, first step of 2fa activation*/
    async generate2Fa(email:string) {

        const foundUser = await this.authservice.findUserByEmail(email);
        if (!foundUser)
            throw new UnauthorizedException("Activate2Fa: No such user found.");

        const secretKey  = await this.authservice.createSecretKey();

        const updateUser = await this.prisma.user.update({
            where: {id: foundUser.id},
            data: {twoFaSecret:secretKey},
        })

        const qrUrl = await this.authservice.generateTwoFaQRCode(foundUser, secretKey);
        return qrUrl;
    }

    /*turns on the 2fa: if the provided code is correct=> twoFa: true. this is the final step of enabling 2fa*/
    async activate2Fa(code:string, email: string) {

        const foundUser = await this.authservice.findUserByEmail(email);
        if (!foundUser)
            throw new UnauthorizedException("Verify2FaCode: No such user found.");

        const verified = authenticator.verify({
            token: code,
            secret: foundUser.twoFaSecret,
        });

        if (verified)
        {
            const updateUser = await this.prisma.user.update({
                where: {id: foundUser.id},
                data: {twoFa: true},
            })

        const newToken = await this.authservice.generateJwtToken({
            email: foundUser.email,
            id: foundUser.id,
            name: foundUser.name,
            twoFa: true,});

        const newRefreshToken = await this.authservice.generateRefreshToken({
            email: foundUser.email,
            id: foundUser.id,
            name: foundUser.name,
            twoFa: true
        });

        return {"token": newToken, "refreshToken": newRefreshToken };
        }

        throw new BadRequestException("Verify2FaCode: Invalid code.");
    }

    /*authenticate signing in with 2fa*/
    async authenticate2Fa(code: string, email:string, response: Response){
        const foundUser = await this.authservice.findUserByEmail(email);
        if (!foundUser)
            throw new UnauthorizedException("Authenticate2Fa: No such user found.");
        const verified = authenticator.verify({
            token: code,
            secret: foundUser.twoFaSecret,
        });
        if (!verified)
            throw new Error("Authenticate2Fa: Invalid code.");

        const newToken = await this.authservice.generateJwtToken({
            email: foundUser.email,
            id: foundUser.id,
            name: foundUser.name,
            twoFa: true,
        });

        const newRefreshToken = await this.authservice.generateRefreshToken({
            email: foundUser.email,
            id: foundUser.id,
            name: foundUser.name,
            twoFa: true,
        });

        response.status(200);
        // response.cookie("token", newToken);
        // response.redirect("http://localhost:3000/home")
        response.json({token: newToken, refreshToken: newRefreshToken});
        return response;
        }


        async deactivate2Fa(code: string, email: string) {
            const foundUser = await this.authservice.findUserByEmail(email);
            if (!foundUser)
                throw new BadRequestException("Deactivate2Fa: No such user found.");

            const verified = authenticator.verify({
                token: code,
                secret:foundUser.twoFaSecret });
                // console.log("here", code, foundUser.twoFaSecret, verified);

            if (!verified)
            {
                const updateUser = await this.prisma.user.update({
                    where: {id: foundUser.id},
                    data: {twoFa: false, twoFaSecret:''}})
                const newToken = await this.authservice.generateJwtToken({email: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: false});
                const newRefreshToken = await this.authservice.generateRefreshToken({email: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: false});

                return {
                    newToken,
                    newRefreshToken,
                }
            }
            else
                throw new BadRequestException("Deactivate2Fa: Code not valid")

        }

        async get2faState(email: string) {
            const foundUser = await this.authservice.findUserByEmail(email);
            return {
                twoFa: foundUser.twoFa,
            }
        }

}