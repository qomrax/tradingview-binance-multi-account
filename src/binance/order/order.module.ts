import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientsService } from '../clients/clients.service';
import { ClientsModule } from '../clients/clients.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  providers: [OrderService, ClientsService, UsersService],
  imports: [ClientsModule, UsersModule]

})
export class OrderModule { }
