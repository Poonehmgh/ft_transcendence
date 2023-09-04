import {IsNotEmpty, IsString, IsEmail, Length} from "class-validator";

export class AuthDto{
    @IsEmail()
    public email: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20, {message: "Password has to be between 3 and 20 chars"})
    public password: string;

    @IsNotEmpty()
    @IsString()
    public name: string;

    @IsNotEmpty()
    @IsString()
    public intraID: string;

    @IsNotEmpty()
    @IsString()
    public badge: string;

    @IsNotEmpty()
    @IsString()
    public status: string;

    @IsNotEmpty()
    @IsString()
    public avatar: string;
    
}