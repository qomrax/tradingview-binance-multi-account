import { Module } from '@nestjs/common';
import { OrderService } from './order/order.service';
import { ClientsService } from './clients/clients.service';
import { ClientsModule } from './clients/clients.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { CalculateService } from './calculate/calculate.service';
import { CalculateModule } from './calculate/calculate.module';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';
import { PositionService } from './position.service';

@Module({
    providers: [OrderService, ClientsService, UsersService, CalculateService, UtilsService, PositionService],
    imports: [ClientsModule, UsersModule, CalculateModule, UtilsModule]
})
export class PositionModule { }
