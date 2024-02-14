import {BadRequestException, ForbiddenException, Injectable, InternalServerErrorException, Req} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {jwtSecret, jwtExpire} from "../utils/constants"
import {Request, Response} from "express"
import {TwoFaCodeDto, TwoFaDto} from "./dto/2fa.dto";
import {authenticator} from "otplib"; //chek
import * as QRCode from "qrcode"
import {User_42} from "./interfaces/user_42.interface";
import { User } from '@prisma/client';


export type signInReturn = {
    qrcode?: any,
    url?: string,
    newToken: string,
};

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    //registers and/or finds the user in db and returns it.
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
        //302: Found, temporary redirect.
        response.status(302).redirect("http://localhost:3000/home");
        return response;
    }




    async ftSignin(user): Promise<signInReturn>
    {
        if (!user)
            throw new BadRequestException("Unauthenticated user.");
        let foundUser = await this.findUserByEmail(user.email);
        if (!foundUser)
            foundUser = await this.registerUser(user);

        if (foundUser && !foundUser.twoFa && foundUser.twoFaSecret)
        {
            const {qrcode, url} = await this.generateTwoFaQRCode(foundUser, foundUser.twoFaSecret);
            const newToken = await this.generateJwtToken(
                {
                    email: foundUser.email,
                    id: foundUser.id,
                    name: foundUser.name,
                    twoFa: true});
            return {
                qrcode,
                url,
                newToken,
            }
        }
        const newToken = await this.generateJwtToken({
                email: foundUser.email,
                id: foundUser.id,
                name: foundUser.name,
                twoFa: false,
            })
        return {
            newToken,
        };
    }

    async validateUser(payload) {
        const { id } = payload.id;
        const foundUser = await this.findUserById(id);
        if (!foundUser) throw new BadRequestException("Unauthenticated.");
        return foundUser;
    }

    async registerUser(user) {
        const { id, email, surname } = user;
        const name: string = user.name;

        try{
            const newUser = this.prisma.user.create({
                data: {
                    id: Number(id),
                    name: name,
                    email: email,
                    twoFa: false,

                   // name: name + (surname ? ` ${surname}` : '')
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
                // expiresIn: jwtExpire
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

    async activate2Fa(user) {
        try{
            const secretKey = await this.createSecretKey();
            const foundUser = await this.findUserByEmail(user.email);
            if (!foundUser)
                throw new BadRequestException("Activate2Fa: No such user found.");
            const {qrcode, url} = await this.generateTwoFaQRCode(foundUser, secretKey);
            const updateUser = await this.prisma.user.update({
                where: {id: foundUser.id},
                data: {twoFa: false, twoFaSecret:secretKey},
            })
            const newToken = await this.generateJwtToken({email: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: true});
            return {
                qrcode,
                url,
                newToken,
            }
        }
        catch(e)
        {
            throw new BadRequestException("Activate2Fa: Something went wrong.");
        }
    }

    async deactivate2fa(twoFaDto: TwoFaCodeDto, user){
            const foundUser = await this.findUserByEmail(user.email);
            if (!foundUser)
                throw new BadRequestException("Deactivate2Fa: No such user found.");
            if (authenticator.verify({
                token: twoFaDto.code,
                secret:foundUser.twoFaSecret }))
            {
            const updateUser = await this.prisma.user.update({
                where: {id: foundUser.id},
                data: {twoFa: false, twoFaSecret:''},
            })
            const newToken = await this.generateJwtToken({email: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: false});
            return {
                newToken,
            }
            }
            else
                throw new BadRequestException("Deactivate2Fa: Wrong code")

    }

    async verify2Fa(twoFaDto: TwoFaCodeDto, user){
        const code = twoFaDto.code;

        const foundUser = await this.findUserByEmail(user.email);
        if (!foundUser)
            throw new BadRequestException("Verify2Fa: User not found.");
        const verified = authenticator.verify({
            token: code,
            secret:foundUser.twoFaSecret,
        });
        if (verified)
        {
            const updateUser = await this.prisma.user.update({
                where: {id: foundUser.id},
                data: {twoFa: true},
            })
            const newToken = await this.generateJwtToken({email: foundUser.email,
                id: foundUser.id,
                name: foundUser.name,
                twoFa: foundUser.twoFa});
            return newToken;
        }
        throw new BadRequestException("Verify2Fa: Invalid code.");
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
    //
    // async comparePasswords(input: {password: string, hash:string}){
    //     return await bcrypt.compare(input.password, input.hash)
    // }
    //
    // async signToken(input:{id: number, email: string}){
    //     const payload = input;
    //     return this.jwt.signAsync(payload, {secret: jwtSecret});
    // }
}
