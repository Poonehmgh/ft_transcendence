import {IsString, IsEmail, IsNumber, IsNotEmpty} from 'class-validator';

export class TwoFaDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class TwoFaCodeDto {

    @IsString()
    @IsNotEmpty()
    code: string;

    // @IsEmail()
    // email: string;
}

export class TwoFaCodeDto2 {

    @IsString()
    @IsNotEmpty()
    code: string;

    @IsEmail()
    email: string;
}