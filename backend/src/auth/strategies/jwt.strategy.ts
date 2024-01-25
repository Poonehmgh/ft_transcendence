import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {AuthService} from "../auth.service";
import {jwtSecret} from "../../utils/constants";

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
            secretOrKey: jwtSecret,
        });
    }
    async validate(payload: JwtPayload){
        const user = await this.authService.validateUserByJwt(payload);
        if (!user)
            console.log("invalid jwt token");
        return user;
    }
}
