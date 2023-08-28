import { Controller, Post, Get, Body } from '@nestjs/common';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() userData) {
        return this.userService.createUser(userData);
    }

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }
}




