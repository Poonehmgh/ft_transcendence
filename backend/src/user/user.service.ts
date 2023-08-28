import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import {User} from "@prisma/client";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async createUser(userData) {
        return this.prisma.user.create({ data: userData });
    }

    async getAllUsers()  {
        return this.prisma.user.fields
    }
}

