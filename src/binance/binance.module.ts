import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ClientsService } from './clients/clients.service';
import { OrderModule } from './order/order.module';
import { CalculateModule } from './calculate/calculate.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { OrderService } from './order/order.service';
import { CalculateService } from './calculate/calculate.service';

@Module({
  providers: [BinanceService, UsersService, ClientsService, UtilsService, OrderService, CalculateService],
  controllers: [BinanceController],
  imports: [UsersModule, ClientsModule, OrderModule, CalculateModule, UtilsModule]
})
export class BinanceModule { }
