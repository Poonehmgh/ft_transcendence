import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma/prisma.service";
import {JwtService} from "@nestjs/jwt";
import {TwoFaDto} from "./dto/2fa.dto";

@Injectable()
export class TwoFaService {
    constructor() {
    }
    activate(twoFaDto: TwoFaDto){

        return twoFaDto.username;
    }
}
