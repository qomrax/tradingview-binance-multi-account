import { Module } from '@nestjs/common';
import { BinanceService } from './binance.service';
import { BinanceController } from './binance.controller';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';
import { PositionService } from './position/position.service';
import { PositionModule } from './position/position.module';
import { ClientManagerModule } from './client-manager/client-manager.module';
import { ClientManagerService } from './client-manager/client-manager.service';
import { ErrorService } from 'src/binance/error/error.service';
import { ErrorModule } from 'src/binance/error/error.module';
import { ResponseModule } from './response/response.module';
import { ResponseService } from './response/response.service';

@Module({
  providers: [BinanceService, UsersService, UtilsService, PositionService, ClientManagerService, ErrorService, ResponseService],
  controllers: [BinanceController],
  imports: [UsersModule, UtilsModule, PositionModule, ClientManagerModule, ErrorModule, ResponseModule]
})
export class BinanceModule { }
