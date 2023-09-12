import {PassportStrategy } from "@nestjs/passport"
import {Injectable} from "@nestjs/common";
import {Strategy, Profile} from "passport-42"
import {VerifiedCallback, VerifyCallback} from "passport-jwt";
import {AuthService} from "../auth.service";

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, "42")
{
    constructor(private authService: AuthService) {
        super( // super classes constructor
            {
                clientID        : "u-s4t2ud-d84ce7e479045f5806c6c8d86b2612146f645456a46294145b778c08d87aa3b4",
                clientSecret    : "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",
                callbackURL     : "http://loaclhost:5500/auth/42/redirect",
                // scope           : null,
            });

        }
async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {

        console.log("Access token is" , accessToken);
        return this.authService.ft_oauth()
}



}


