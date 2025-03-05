import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';

@Module({
  providers: [ClientsService, UsersService],
  exports: [ClientsService],
  imports: [UsersModule]
})
export class ClientsModule { }
