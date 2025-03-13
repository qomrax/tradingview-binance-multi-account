import { Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { HttpResponseLocal } from './http-response';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { ResponseController } from './response.controller';
@Module({
  providers: [ResponseService, UsersService],
  imports: [UsersModule, TypeOrmModule.forFeature([HttpResponseLocal])],
  exports: [TypeOrmModule],
  controllers: [ResponseController]
})
export class ResponseModule { }
