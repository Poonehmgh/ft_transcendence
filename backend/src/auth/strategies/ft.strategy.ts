import {PassportStrategy } from "@nestjs/passport"
import {Injectable} from "@nestjs/common";
import {Strategy, Profile, User} from "passport-42"
import {VerifiedCallback, VerifyCallback} from "passport-jwt";
import {AuthService} from "../auth.service";
import {configDotenv} from "dotenv";
import * as process from "process";

// 42 school macs

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, "42")
{
    constructor(private authService: AuthService) {
        super(
            {
                // clientID        : process.env.CLIENT_ID,
                // clientSecret    : process.env.CLIENT_SECRET,
                // callbackURL     : process.env.CALLBACK_URL,
                clientID         : "u-s4t2ud-a1e6bb66d033753e98c64013551560a81f697b501c70a0eee65826b47db3bfb3",
                clientSecret     : "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",
                callbackURL      : "http://10.12.18.114:5500/auth/42/redirect",
            });
        }

    async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) {

            const {id, username, emails, name} = profile;

            const user: User = {
                provider: "42",
                id: id,
                user: username,
                email: emails[0].value,
                name: name.givenName,
                surname: name.familyName,
            };
            done(null, user);
    }
}


