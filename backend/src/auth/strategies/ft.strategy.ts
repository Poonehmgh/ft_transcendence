import {PassportStrategy } from "@nestjs/passport"
import {Injectable} from "@nestjs/common";
import {Strategy} from "passport-oauth2"

@Injectable()
export class ftStrategy extends PassportStrategy(Strategy, "42")
{
    constructor() {
        super(
            {
                authorizationURL: null,
                tokenURL        : null,
                clientID        : null,
                clientSecret    : null,
                callbackURL     : null,
                scope           : null,
            });
    }

}


