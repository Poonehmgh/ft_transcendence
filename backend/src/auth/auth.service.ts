import {BadRequestException, ForbiddenException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {jwtSecret} from "../utils/constants"
import {Request, Response} from "express"
import {TwoFaDto} from "./dto/2fa.dto";
import {authenticator} from "otplib";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}

    async ft_signin(user)
    {
        if (!user)
            throw new BadRequestException("Unauthenticated.");
        const foundUser = await this.findUserByEmail(user.email);
        if (!foundUser)
            return this.registerUser(user);
        console.log("user is found: ", user)
        return this.generateJwtToken({
            email: foundUser.email,
            id: foundUser.id,
            name: foundUser.name,
        })
    }

    async ft_oauth(){
        console.log("hi from inside this")
        return "intra_auth"
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
        const secretKey = authenticator.generateSecret();
        console.log("scret: ",secretKey);
        const hashedSecretKey = await this.hashKey(secretKey);
        try{
            const newUser = await this.prisma.user.create({
                data: {
                    id: Number(id),
                    name: name,
                    email: email,
                    twoFa: false,
                    twoFaSecret: hashedSecretKey,
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
            throw new InternalServerErrorException();
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

            const foundUser = await this.findUserByEmail(twoFaDto.email);
            if (!foundUser)
                return new BadRequestException("User not found.");
            const updateUser = await this.prisma.user.update({
                where: {
                    id: foundUser.id},
                data:{
                    twoFa: true,
                },
            });
            return this.generateJwtToken({mail: foundUser.email, id: foundUser.id, name: foundUser.name, twoFa: true})
        }catch (e) {
            throw new BadRequestException("Something went wrong.");
        }
    }

    generateRandomSecret(){

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
    async hashKey(key: string){
        const saltOrRounds = 10;
        return await bcrypt.hash(key, saltOrRounds);
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
