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
                clientID        : "u-s4t2ud-44b53d4a9d24b54875d1747b38eeafd48138c02c2d654e48821681959a95c4ad",
                clientSecret    : "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",
                callbackURL     : "http://localhost:5500/auth/42/redirect",
                // scope           : null,
            });

        }
    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {

            console.log("Access token is" , accessToken);
            return this.authService.ft_oauth()
    }
}


