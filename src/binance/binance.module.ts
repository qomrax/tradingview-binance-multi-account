import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule } from './position/clients/clients.module';
import { ClientsService } from './position/clients/clients.service';
import { OrderModule } from './position/order/order.module';
import { CalculateModule } from './position/calculate/calculate.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { OrderService } from './position/order/order.service';
import { CalculateService } from './position/calculate/calculate.service';
import { PositionService } from './position/position.service';
import { PositionModule } from './position/position.module';

@Module({
  providers: [BinanceService, UsersService, ClientsService, UtilsService, OrderService, CalculateService, PositionService],
  controllers: [BinanceController],
  imports: [UsersModule, ClientsModule, OrderModule, CalculateModule, UtilsModule, PositionModule]
})
export class BinanceModule { }
