import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { CalculateService } from '../calculate/calculate.service';
import { CalculateModule } from '../calculate/calculate.module';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  providers: [OrderService, CalculateService, UtilsService],
  imports: [CalculateModule, UtilsModule]
})
export class OrderModule { }
