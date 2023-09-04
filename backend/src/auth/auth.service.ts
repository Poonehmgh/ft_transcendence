import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService ) {}
    async signup(dto: AuthDto){
        const {email, password, name, badge, intraID, status, avatar} = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: {
                email: email,
            },
        });
        if (foundUser)
            throw new BadRequestException("ID already exists")
        const hashedPassword = await this.hashPassword(password);
        await this.prisma.user.create({
            data: {         //investigate later: why cannot skip the items that have a default value like avatar?
                email: email,
                passHash: hashedPassword,
                intraID: intraID,
                userName: name,
                badgeName: badge,
                chatStatus: status,
                avatar: avatar
            }
        })

        return ({message: "sign_up was successful"})
    }

    async signin(){
        return ""
    }
    async signout(){
        return ""
    }

    async hashPassword(password: string){
        const saltOrRounds = 10;
        const hashedPassword  = await bcrypt.hash(password, saltOrRounds);

        return hashedPassword
    }
}
