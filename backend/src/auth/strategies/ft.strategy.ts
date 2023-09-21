import {PassportStrategy } from "@nestjs/passport"
import {Injectable} from "@nestjs/common";
import {Strategy, Profile, User} from "passport-42"
import {VerifiedCallback, VerifyCallback} from "passport-jwt";
import {AuthService} from "../auth.service";

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, "42")
{
    constructor(private authService: AuthService) {
        super(
            {
                clientID        : "u-s4t2ud-44b53d4a9d24b54875d1747b38eeafd48138c02c2d654e48821681959a95c4ad",
                clientSecret    : "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",
                callbackURL     : "http://localhost:5500/auth/42/redirect",
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


