import {Controller, Get, Body, Post, UseGuards} from '@nestjs/common';
import {TwoFaService} from "./twofa.service";
import {TwoFaDto} from "./dto/2fa.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {ftAuthGuard} from "../auth/guards/intra_42.guard";

@Controller('2fa')
export class TwoFaController {
    constructor(private readonly twoFaService: TwoFaService) {
    }

  @Post("/activate")
  @UseGuards(JwtAuthGuard)
  activate(@Body() twoFaDto: TwoFaDto){
    return this.twoFaService.activate(twoFaDto);
  }

  @Get("/test")
    @UseGuards(JwtAuthGuard)
    test(){
        return "hi"
  }
  
}
