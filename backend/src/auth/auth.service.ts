import {BadRequestException, ForbiddenException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";
import {JwtService} from "@nestjs/jwt";
import {jwtSecret} from "../utils/constants"
import {Request, Response} from "express"
@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwt: JwtService) {}
    async signup(dto: AuthDto){
        const {email, password, name, badge, intraID, status, avatar} = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (foundUser)
            throw new BadRequestException("Email already exists")
        const hashedPassword = await this.hashPassword(password);
        await this.prisma.user.create({
            data: {         //investigate later: why cannot skip the items that have a default value like avatar?
                email: email,
                passHash: hashedPassword,
                intraID: intraID,
                name: name,
                badgeName: badge,
            }
        })

        return ({message: "sign_up was successful"})
    }

    async signin(dto: AuthDto, req: Request, res: Response){
        const {email, password, name, badge, intraID, status, avatar} = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (!foundUser)
            throw new BadRequestException("Wrong credentials.")
        const isMatched = await this.comparePasswords({password,
        hash: foundUser.passHash,
        })

        if (!isMatched)
            throw new BadRequestException("Password is wrong.")
        // sign jwt tokens:
        const token = await this.signToken({
            id: foundUser.id,
            email: foundUser.email,
        });
        if (!token){
            throw new ForbiddenException();
        }
        res.cookie("tocken", token)
        // return {token}
        return res.send("the login was successful!")
    }
    async signout(){
        return ""
    }

    async hashPassword(password: string){
        const saltOrRounds = 10;
        return await bcrypt.hash(password, saltOrRounds);
    }

    async comparePasswords(input: {password: string, hash:string}){
        return await bcrypt.compare(input.password, input.hash)
    }

    async signToken(input:{id: number, email: string}){
        const payload = input;
        return this.jwt.signAsync(payload, {secret: jwtSecret});
    }
}
