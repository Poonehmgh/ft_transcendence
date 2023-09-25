import { Controller, Get } from '@nestjs/common';

@Controller('2fa')
export class TwofaController {
  
  @Get("/activate")
   activate(){
    return {msg: "hello from 2fa"};
  }
  
}
