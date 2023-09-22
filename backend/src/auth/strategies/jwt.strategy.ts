import {Injectable} from "@nestjs/common";
import {PassportStrategy} from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import {AuthService} from "../auth.service";
import {jwtSecret} from "../../utils/constants";

export class JwtPayload{
    mail: string;
    name: string;
    id: string | number;
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
        console.log("jwt strategy is called");
        const user = await this.authService.validateUserByJwt(payload);
        if (!user)
            console.log("invalid jwt token");
        return user;
    }
}
