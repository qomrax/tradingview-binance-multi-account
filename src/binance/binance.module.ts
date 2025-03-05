import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ClientsModule } from './clients/clients.module';
import { ClientsService } from './clients/clients.service';
import { OrderModule } from './order/order.module';

@Module({
  providers: [BinanceService, UsersService, ClientsService],
  controllers: [BinanceController],
  imports: [UsersModule, ClientsModule, OrderModule]
})
export class BinanceModule { }
