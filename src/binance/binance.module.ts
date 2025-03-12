import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { OrderModule } from './position/order/order.module';
import { CalculateModule } from './position/calculate/calculate.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { OrderService } from './position/order/order.service';
import { CalculateService } from './position/calculate/calculate.service';
import { PositionService } from './position/position.service';
import { PositionModule } from './position/position.module';
import { ClientManagerModule } from './client-manager/client-manager.module';
import { ClientManagerService } from './client-manager/client-manager.service';

@Module({
  providers: [BinanceService, UsersService, UtilsService, OrderService, CalculateService, PositionService, ClientManagerService],
  controllers: [BinanceController],
  imports: [UsersModule, OrderModule, CalculateModule, UtilsModule, PositionModule, ClientManagerModule]
})
export class BinanceModule { }
