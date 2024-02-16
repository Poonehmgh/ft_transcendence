
import {AuthGuard} from "@nestjs/passport";
import {Injectable, ExecutionContext} from "@nestjs/common";

@Injectable()
export class ftAuthGuard extends AuthGuard("42"){
}