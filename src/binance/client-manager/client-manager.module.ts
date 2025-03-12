import { Module } from '@nestjs/common';
import { ClientManagerService } from './client-manager.service';
import { PositionService } from '../position/position.service';
import { PositionModule } from '../position/position.module';
import { OrderModule } from '../position/order/order.module';
import { OrderService } from '../position/order/order.service';
import { CalculateModule } from '../position/calculate/calculate.module';
import { CalculateService } from '../position/calculate/calculate.service';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ErrorService } from 'src/error/error.service';
import { ErrorModule } from 'src/error/error.module';


@Module({
  providers: [ClientManagerService, PositionService, OrderService, CalculateService, UtilsService, UsersService, ErrorService],
  imports: [PositionModule, OrderModule, CalculateModule, UtilsModule, UsersModule, ErrorModule]
})
export class ClientManagerModule { }