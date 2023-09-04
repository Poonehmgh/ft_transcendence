import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
    constructor() {}
    async signup(){
        return ({message: "sign_up was successfull"})
    }
    async signin(){
        return ""
    }
    async signout(){
        return ""
    }
}
