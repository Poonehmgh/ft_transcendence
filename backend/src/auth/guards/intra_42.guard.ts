
import {AuthGuard} from "@nestjs/passport";
import {Injectable, ExecutionContext} from "@nestjs/common";

@Injectable()
export class ftAuthGuard extends AuthGuard("42"){
    // async canActivate(context: ExecutionContext) { //what is happening here?
    //     const activate = (await super.canActivate(context)) as boolean;
    //     const request = context.switchToHttp().getRequest();
    //     await super.logIn(request);
    //     return activate;
    // }
}