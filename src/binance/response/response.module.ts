import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { HttpResponseLocal } from './http-response';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
@Module({
  providers: [ResponseService, UsersService],
  imports: [UsersModule, TypeOrmModule.forFeature([HttpResponseLocal])],
  exports: [TypeOrmModule]
})
export class ResponseModule { }
