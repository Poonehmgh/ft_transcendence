/*Express*/
import {Request, Response} from "express"

/*NestJS*/
import {BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Req} from '@nestjs/common';
/*Prisma*/

import {PrismaService} from "../prisma/prisma.service";
import { User } from '@prisma/client';

/*BCRYPT  & QR Code*/
import * as bcrypt from "bcrypt";
import * as QRCode from "qrcode"
import {authenticator} from "otplib"; //chek

/*JWT*/
import {JwtService} from "@nestjs/jwt";
import {jwtSecret, jwtExpire} from "../utils/constants"

/*Interface*/
import {User_42} from "./interfaces/user_42.interface";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    /*registers and/or finds the user in db and returns it.*/
    async signin(user: User_42): Promise<User>{

        if (!user)
            throw new BadRequestException("Unauthenticated user.");

        let foundUser = await this.findUserByEmail(user.email);

        if (!foundUser)
            foundUser = await this.registerUser(user);

        return foundUser;
    }

    async signin_token(response: Response, user: User){

        const newToken = await this.generateJwtToken({
            email: user.email,
            id: user.id,
            name: user.name,
            twoFa: false,
        });

        response.cookie("token", newToken);
        const apiUrl = process.env.FRONTEND_URL
        response.status(302).redirect(apiUrl);
        return response;
    }

    async validateUser(payload) {
        const { id } = payload.id;
        const foundUser = await this.findUserById(id);
        if (!foundUser) throw new BadRequestException("Unauthenticated.");
        return foundUser;
    }

    async registerUser(user) {
        const { id, email, surname } = user;
        let name: string = user.name;

        let findUnique = await this.prisma.user.findUnique({
            where: {
                name: name,
            }
        })

        if (findUnique)
        {
            for (let i = 1; i < 100; i++)
            {
                const newName = name + "_" + i;
                let findUnique = await this.prisma.user.findUnique({
                    where: {
                        name: newName,
                    }
                })
                if (!findUnique)
                {
                    name = newName;
                    break;
                }
            }
        }

        try{
            const newUser = this.prisma.user.create({
                data: {
                    id: Number(id),
                    name: name,
                    email: email,
                    twoFa: false,
                }
            })
            return newUser;
        }
        catch {
            throw new InternalServerErrorException("Unable to register user.");
        }
    }

    async validateUserByJwt(payload){
        const {id, email} = payload;
        const foundUser = await this.findUserByEmail(email);
        if (!foundUser)
            throw new BadRequestException("JWT Verification: User not found.");
        return foundUser;
    }

    async generateJwtToken(payload: {id: number, email: string, name: string, twoFa: boolean}) {
        const token = await this.jwt.signAsync(payload,
            {
                secret: jwtSecret,
            });
        if (!token) {
            throw new ForbiddenException();
        }

        await this.prisma.user.update({
            where: { id: payload.id },
            data: { online: true },
        });

        console.log("token is", token);
        return token;
    }

    async generateRefrehToken(payload: {id: number, email: string, name: string, twoFa: boolean}) {
        const refreshToken = await this.jwt.signAsync(payload,
            {
                secret: jwtSecret,
                expiresIn: jwtExpire,
            });

        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);


        await this.prisma.user.update({
            where: { id: payload.id },
            data: { refreshToken: hashedRefreshToken }
        });

        return refreshToken;
    }


    async generateTwoFaQRCode(user, secret){
        const url = await this.otpAuthUrl(user.email, secret);
        const qrcode = await this.generateQRCode(url);

        return {
            qrcode,
            url,
        };
    }

    async createSecretKey(){
        const secretKey = authenticator.generateSecret();;
        return secretKey;
    }

    async hashKey(key: string){
        const saltOrRounds = 10;
        return await bcrypt.hash(key, saltOrRounds);
    }

    async otpAuthUrl(email: string, secretKey: string) {
        return authenticator.keyuri(email, "transcendence", secretKey);
    }

    async generateQRCode(url: string){
        const qrCode = QRCode.toDataURL(url);
        if (!qrCode)
            throw new BadRequestException("Activate2Fa:Something went wrong when generating QR code.");
        return qrCode;
    }

    async findUserById(id: number) {
        return this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    async findUserByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

}
