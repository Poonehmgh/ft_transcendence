import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {AuthService} from "../auth.service";
import {jwtSecret} from "../../utils/constants";
import {Request} from "express";
import fromAuthHeaderAsBearerToken = ExtractJwt.fromAuthHeaderAsBearerToken;

export class JwtPayload{
    email: string;
    name: string;
    id: string | number;
    twoFa: boolean;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt"){
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            // jwtFromRequest: getToken,
            // jwtFromRequest:ExtractJwt.fromExtractors([getToken, fromAuthHeaderAsBearerToken()]),
            secretOrKey: jwtSecret,
        });
    }
    async validate(payload: JwtPayload){
        const user = await this.authService.validateUserByJwt(payload);
        if (!user)
            console.log("Invalid JWT token.");
        return user;
    }
}

const getToken = (req: Request) =>{
    let token = null;
    if (req && req.cookies)
        token = req.cookies['token'];
    return token;
}
