import { Global, Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { UsersModule } from 'src/users/users.module';
import { UsersService } from 'src/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpErrorLocal } from './http-error-local.entity';
import { ErrorController } from './error.controller';

@Module({
  providers: [ErrorService, UsersService],
  imports: [UsersModule, TypeOrmModule.forFeature([HttpErrorLocal])],
  exports: [TypeOrmModule],
  controllers: [ErrorController]
})
export class ErrorModule { }
