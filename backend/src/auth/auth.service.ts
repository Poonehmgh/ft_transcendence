import {BadRequestException, ForbiddenException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {jwtSecret} from "../utils/constants"
import {Request, Response} from "express"
import {TwoFaCodeDto, TwoFaDto} from "./dto/2fa.dto";
import {authenticator} from "otplib"; //chek
import * as speakeasy from "speakeasy"
import * as QRCode from "qrcode"


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async ftSignin(user)
    {
        if (!user)
            throw new BadRequestException("Unauthenticated.");
        const foundUser = await this.findUserByEmail(user.email);
        if (!foundUser)
            return this.registerUser(user);
        console.log("user is found: ", user)
        try {
            // if (foundUser.twoFa)
            //     this.twoFaQRcode(user);
            return this.generateJwtToken({
                email: foundUser.email,
                id: foundUser.id,
                name: foundUser.name,
            })
        } catch (e) {
            throw new BadRequestException("Something went wrong when trying to authenticate via two factor.");
        }
    }

    async ftOauth(){
        return "This is never called."
    }

    async ft2FaLogin_FirstStep(user: any){
        const foundUser = await this.findUserByEmail(user.email);
        if (!foundUser)
            throw new BadRequestException("User not found.");
        return this.generateTwoFaQRCode(foundUser);
    }

    async validate2FaCode(twoFaCodeDto: TwoFaCodeDto){
        const {code, email, id} = twoFaCodeDto;
        const foundUser = await this.findUserByEmail(email);
        if (!foundUser)
            throw new BadRequestException("User not found.");
        const verified = authenticator.verify({token: code, secret: foundUser.twoFaSecret})
        if (!verified)
            throw new BadRequestException("Invalid code.");
        return this.generateJwtToken({mail: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: true})
    }

    async validateUser(payload){
        const {id} = payload.id;
        const foundUser = await this.findUserById(id);
        if (!foundUser)
            throw new BadRequestException("Unauthenticated.");
        return foundUser;
    }

    async registerUser(user){
        const {id, email, surname } = user;
        const name: string = user.name;
        try{
            const newUser = await this.prisma.user.create({
                data: {
                    id: Number(id),
                    name: name,
                    email: email,
                    twoFa: false,
                   // name: name + (surname ? ` ${surname}` : '')
                }
            })
            return this.generateJwtToken({
                email: newUser.email,
                id: newUser.id,
                name: newUser.name,
                twoFa: false,
            })
        }
        catch {
            throw new InternalServerErrorException("Unable to register user.");
        }
    }


    async validateUserByJwt(payload){
        const {id, email} = payload;
        console.log("payload is", payload, "sub is", id)
        const foundUser = await this.findUserByEmail(email);
        if (!foundUser)
            throw new BadRequestException("not found.");
        return foundUser;
    }

    async generateJwtToken(payload){
        const token = await this.jwt.signAsync(payload, {secret: jwtSecret});
        if (!token){
            throw new ForbiddenException();
        }
        console.log("token is", token);
        return token;
    }

    async findUserById(id:number){
        return this.prisma.user.findUnique({
            where: {
                id: id,
            },
        });
    }
    async findUserByEmail(email:string){
        return this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }

    async activate(twoFaDto: TwoFaDto){
        try{
            const secretKey = await this.createSecretKey();
            const foundUser = await this.findUserByEmail(twoFaDto.email);
            if (!foundUser)
                return new BadRequestException("User not found.");
            const updateUser = await this.prisma.user.update({
                where: {
                    id: foundUser.id},
                data:{
                    twoFa: true,
                    twoFaSecret: secretKey,
                },
            });
            return this.generateJwtToken({mail: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: true})
        } catch (e) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    async generateTwoFaQRCode(user){
        const url = await this.otpAuthUrl(user.email, user.twoFaSecret);
        const qrCode = await this.generateQRCode(url);
        console.log("QR url", qrCode );
        return {qrCode,
            url,};
    }
    // async signup(dto: AuthDto){
    //     const {email, password, name, badge, intraID, status, avatar} = dto;
    //     const foundUser = await this.prisma.user.findUnique({
    //         where: {
    //             email: email,
    //         },
    //     });
    //     if (foundUser)
    //         throw new BadRequestException("Email already exists")
    //     const hashedPassword = await this.hashPassword(password);
    //     await this.prisma.user.create({
    //         data: {         //investigate later: why cannot skip the items that have a default value like avatar?
    //             email: email,
    //             passHash: hashedPassword,
    //             intraID: intraID,
    //             name: name,
    //         }
    //     })
    //
    //     return ({message: "sign_up was successful"})
    // }
    // async signin(dto: AuthDto, req: Request, res: Response){
    //     const {email, password, name, badge, intraID, status, avatar} = dto;
    //     const foundUser = await this.prisma.user.findUnique({
    //         where: {
    //             email: email,
    //         },
    //     });
    //     if (!foundUser)
    //         throw new BadRequestException("Wrong credentials.")
    //     const isMatched = await this.comparePasswords({password,
    //     hash: foundUser.passHash,
    //     })
    //
    //     if (!isMatched)
    //         throw new BadRequestException("Password is wrong.")
    //     // sign jwt tokens:
    //     const token = await this.signToken({
    //         id: foundUser.id,
    //         email: foundUser.email,
    //     });
    //     if (!token){
    //         throw new ForbiddenException();
    //     }
    //     res.cookie("token", token)
    //     // return {token}
    //     return res.send("the login was successful!")
    // }
    // async signout(){
    //     return ""
    // }
    //
    async createSecretKey(){
        const secretKey = authenticator.generateSecret();;
        return secretKey;
    }
    async hashKey(key: string){
        const saltOrRounds = 10;
        return await bcrypt.hash(key, saltOrRounds);
    }

    async otpAuthUrl(email: string, secretKey: string){
        return authenticator.keyuri(email, "transcendence", secretKey);
    }

    async generateQRCode(url: string){
        const qrCode = await QRCode.toDataURL(url);
        if (!qrCode)
            throw new BadRequestException("Something went wrong when generating QR code.");
        return qrCode;
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
