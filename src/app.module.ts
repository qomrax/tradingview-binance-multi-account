import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvService } from 'src/env/env.service';
import { EnvModule } from 'src/env/env.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { BinanceModule } from './binance/binance.module';
import { ConstantsModule } from './constants/constants.module';
import { ConstantsService } from './constants/constants.service';
import { SettingsModule } from './settings/settings.module';
import { UtilsModule } from './utils/utils.module';
import { ErrorModule } from './binance/error/error.module';
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (envService: EnvService) => ({
        type: 'mysql',
        host: envService.envConfig.DATABASE_HOST,
        port: envService.envConfig.DATABASE_PORT,
        username: envService.envConfig.DATABASE_USERNAME,
        password: envService.envConfig.DATABASE_PASSWORD,
        database: envService.envConfig.DATABASE_NAME,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: envService.isDevelopment,
        autoLoadEntities: true,
        migrationsTransactionMode: "each"
      }),
      inject: [EnvService]
    }),
    JwtModule.registerAsync({
      useFactory: (envService: EnvService) => ({
        secret: envService.envConfig.JWT_KEY,
        signOptions: { expiresIn: '1h' },
      }),
      inject: [EnvService]
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    EnvModule,
    UsersModule,
    AuthModule,
    BinanceModule,
    ConstantsModule,
    SettingsModule,
    UtilsModule,
    ErrorModule,
  ],
  controllers: [],
  providers: [EnvService, ConstantsService],
})
export class AppModule {
  constructor(private envService: EnvService) { }
}