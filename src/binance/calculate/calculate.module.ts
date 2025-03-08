import { Module } from '@nestjs/common';
import { OrderSide_LT, FuturesAccountInfoResult, MarkPriceResult } from 'binance-api-node';
import { CalculateService } from './calculate.service';

@Module({
    providers: [CalculateService]
})
export class CalculateModule {

}
