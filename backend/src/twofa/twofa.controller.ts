import { Controller, Get, Body, Post } from '@nestjs/common';
import {TwoFaService} from "./twofa.service";
import {TwoFaDto} from "./dto/2fa.dto";

@Controller('2fa')
export class TwoFaController {
    constructor(private readonly twoFaService: TwoFaService) {
    }
  @Post("/activate")
   activate(@Body() twoFaDto: TwoFaDto){
    return this.twoFaService.activate(twoFaDto);
  }
  
}
