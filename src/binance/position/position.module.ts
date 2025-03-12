import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { UtilsService } from 'src/utils/utils.service';
import { UtilsModule } from 'src/utils/utils.module';
import { PositionService } from './position.service';

@Module({
    providers: [UsersService, UtilsService, PositionService],
    imports: [UsersModule, UtilsModule],
    exports: [PositionService]
})
export class PositionModule { }
