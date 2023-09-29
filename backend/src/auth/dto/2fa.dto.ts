import {IsString, IsEmail, IsNumber, IsNotEmpty} from 'class-validator';

export class TwoFaDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    password: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
