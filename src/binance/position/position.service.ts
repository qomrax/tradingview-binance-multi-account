import { Injectable } from '@nestjs/common';
import { OrderService } from './order/order.service';
import { CalculateService } from './calculate/calculate.service';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { FuturesAccountInfoResult, MarkPriceResult, OrderSide_LT, PositionSide_LT } from 'binance-api-node';

import { MarketInfoDto } from './dto/market-info.dto';
import { CustomerClient } from '../client-manager/customer-client';
@Injectable()
export class PositionService {
    constructor(private orderService: OrderService,
        private calculateService: CalculateService,
        private constantsService: ConstantsService,
        private settingsService: SettingsService) {
    }

    private preparePositionInfo(side: OrderSide_LT): PositionSide_LT {
        return side === "BUY" ? "LONG" : "SHORT"
    }

    private prepareMarketInfo(symbol: string, futuresMarkPrice: MarkPriceResult[]): MarketInfoDto {
        return {
            markPrice: this.calculateService.getSymbolPriceFromFuturesMarket(futuresMarkPrice, symbol),
            quantityPrecision: this.constantsService.findPrecisionForSymbol(symbol),
            pricePrecision: this.constantsService.findPricePrecision(symbol),
            minNotional: this.constantsService.findMinNotional(symbol)
        };
    }

    private calculateOrderQuantity(marketInfo: MarketInfoDto, futuresAccountInfo: FuturesAccountInfoResult, notionalPercentage: number) {
        const notional = this.calculateService.calculatePositionNotional(
            marketInfo.minNotional,
            futuresAccountInfo,
            notionalPercentage
        );

        return this.calculateService.calculateQuantity(
            marketInfo.markPrice,
            notional,
            marketInfo.quantityPrecision
        );
    }

    private calculateStopLevels(marketInfo: MarketInfoDto, side: OrderSide_LT, stopLossPercentage: number, takeProfitPercentage: number, leverage: number) {
        return this.calculateService.calculateStopPrices(
            marketInfo.markPrice,
            stopLossPercentage,
            takeProfitPercentage,
            side,
            marketInfo.pricePrecision,
            leverage
        );
    }

    public async openPosition(customerClient: CustomerClient, symbol: string, side: OrderSide_LT, futuresMarkPrice: MarkPriceResult[]) {
        const client = customerClient.client
        const settings = await this.settingsService.getSettings();
        const futuresAccountInfo = await client.futuresAccountInfo();

        const positionInfo = this.preparePositionInfo(side);
        const marketInfo = this.prepareMarketInfo(symbol, futuresMarkPrice);

        const quantity = this.calculateOrderQuantity(marketInfo, futuresAccountInfo, settings.notionalPercentage);
        const [stopLossPrice, takeProfitPrice] = this.calculateStopLevels(
            marketInfo,
            side,
            settings.stopLossPercentage,
            settings.takeProfitPercentage,
            settings.leverage
        );

        const stopOrders = await this.orderService.openStopOrders(
            client,
            symbol,
            side,
            stopLossPrice,
            takeProfitPrice,
            quantity,
            positionInfo
        );

        if (!stopOrders.status) {
            if (stopOrders.cancelStop) {
                await stopOrders.cancelStop();
            }
            return { status: false };
        }

        const mainOrderStatus = await this.orderService.isFailedMarket(
            client,
            symbol,
            side,
            quantity,
            positionInfo
        );

        if (mainOrderStatus.result) {
            await stopOrders.cancelStop();
        }

        return { status: !mainOrderStatus.result };
    }
}

