import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { PositionService } from './position.service';

@Module({
    providers: [UsersService, PositionService],
    imports: [UsersModule],
    exports: [PositionService]
})
export class PositionModule { }
