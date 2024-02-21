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
                clientID        : process.env.CLIENT_ID,
                clientSecret    : process.env.CLIENT_SECRET,
                callbackURL     : process.env.CALLBACK_URL,
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


