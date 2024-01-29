import {PassportStrategy } from "@nestjs/passport"
import {Injectable} from "@nestjs/common";
import {Strategy, Profile, User} from "passport-42"
import {VerifiedCallback, VerifyCallback} from "passport-jwt";
import {AuthService} from "../auth.service";
import {configDotenv} from "dotenv";
import * as process from "process";

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, "42")
{
    constructor(private authService: AuthService) {
        super(
            {

                clientID    : process.env.CLIENT_ID,
                clientSecret    : process.env.CLIENT_SECRET,
                callbackURL     : process.env.CALLBACK_URL,
                // clientID        : "u-s4t2ud-44b53d4a9d24b54875d1747b38eeafd48138c02c2d654e48821681959a95c4ad",
                // clientSecret    : "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",
                // callbackURL     : "http://localhost:5500/auth/42/redirect",
                // scope           : null,
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
            console.log("profile info is " , user.id, user.user, user.email, user.name, user.surname);
            done(null, user);
    }
}


