import { Module } from '@nestjs/common';
import { OrderService } from './order/order.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { CalculateService } from './calculate/calculate.service';
import { CalculateModule } from './calculate/calculate.module';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';
import { PositionService } from './position.service';
// import { ClientManagerModule } from '../client-manager/client-manager.module';
// import { ClientManagerService } from '../client-manager/client-manager.service';
@Module({
    providers: [OrderService, UsersService, CalculateService, UtilsService, PositionService],
    imports: [UsersModule, CalculateModule, UtilsModule],
    exports: [PositionService]
})
export class PositionModule { }
