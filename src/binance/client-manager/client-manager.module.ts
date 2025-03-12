import { Module } from '@nestjs/common';
import { ClientManagerService } from './client-manager.service';
import { PositionService } from '../position/position.service';
import { PositionModule } from '../position/position.module';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { ErrorService } from 'src/binance/error/error.service';
import { ErrorModule } from 'src/binance/error/error.module';
import { ResponseService } from '../response/response.service';
import { ResponseModule } from '../response/response.module';


@Module({
  providers: [ClientManagerService, PositionService, UtilsService, UsersService, ErrorService, ResponseService],
  imports: [PositionModule, UtilsModule, UsersModule, ErrorModule, ResponseModule]
})
export class ClientManagerModule { }