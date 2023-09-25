import { Module } from '@nestjs/common';
import { TwoFaController } from './twofa.controller';
import {TwoFaService} from "./twofa.service";

@Module({
  controllers: [TwoFaController],
  providers: [TwoFaService],
})
export class TwoFaModule {}
