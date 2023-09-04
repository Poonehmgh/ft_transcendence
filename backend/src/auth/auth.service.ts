import {BadRequestException, Injectable} from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {AuthDto} from "./dto/auth.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService ) {}
    async signup(dto: AuthDto){
        const {email, password} = dto;
        const foundUser = await this.prisma.user.findUnique({
            where: {
                email: email, //problem with the email. check why cannot have email checked??
            },
        });
        if (foundUser)
            throw new BadRequestException("ID already exists")
        const hashedPassword = await this.hashPassword(password);
        await this.prisma.user.create({
            data: {
                email: email,
                passHash: hashedPassword,
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
