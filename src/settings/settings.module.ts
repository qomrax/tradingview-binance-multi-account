import { Global, Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Settings } from './settings.entity';
import { ConstantsService } from 'src/constants/constants.service';

@Global()
@Module({
  providers: [SettingsService],
  controllers: [SettingsController],
  imports: [
    TypeOrmModule.forFeature([Settings])
  ],
  exports: [TypeOrmModule, SettingsService],
})
export class SettingsModule { }
