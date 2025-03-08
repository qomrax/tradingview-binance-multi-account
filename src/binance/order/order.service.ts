import { Injectable } from '@nestjs/common';

import { Binance, FuturesAccountInfoResult, FuturesOrder, MarkPrice, MarkPriceResult, PositionSide, PositionSide_LT } from 'binance-api-node';

import { OrderSide_LT } from 'binance-api-node';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { ClientsService } from 'src/binance/clients/clients.service';
import { Settings } from 'src/settings/entity/settings.entity';
import { CalculateService } from '../calculate/calculate.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class OrderService {
    constructor(private constantsService: ConstantsService, private settingsService: SettingsService, private clientsService: ClientsService, private calculateService: CalculateService, private utilsService: UtilsService) {
    }

    private async openFuturesMarketOrder(
        client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        positionSide: PositionSide_LT
    ): Promise<FuturesOrder> {
        return await client.futuresOrder({ symbol, side, quantity, positionSide, type: this.constantsService.MARKET_ORDER_TYPE });
    }

    private async openFuturesStopOrder(
        client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        stopPrice: string,
        positionSide: PositionSide_LT,
        stopLoss: boolean = true
    ) {

        const params = { symbol, side, quantity, stopPrice }

        if (!stopLoss) {
            return await client.futuresOrder({ ...params, type: this.constantsService.MARKET_TAKE_PROFIT_TYPE, positionSide })
        }
        return await client.futuresOrder({ ...params, type: this.constantsService.MARKET_STOP_TYPE, positionSide })
    }

    private async isFailedStop<T>(
        client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        stopPrice: string,
        positionSide: PositionSide_LT,
        stopLoss: boolean = true,
    ): Promise<{ data?: T, result: boolean }> {

        return this.utilsService.isFailed(this.openFuturesStopOrder, [client, symbol, side, quantity, stopPrice, positionSide, stopLoss], this)
    }

    private async isFailedMarket<T>(client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        positionSide: PositionSide_LT

    ) {
        return this.utilsService.isFailed<T>(this.openFuturesMarketOrder, [client, symbol, side, quantity, positionSide], this)

    }

    private async cancelStop(client: Binance, symbol: string) {
        return await client.cancelOpenOrders({ symbol })
    }

    private async openStopOrders(client: Binance, symbol: string, side: OrderSide_LT, stopLossPrice: string, takeProfitPrice: string, quantity: string, positionSide: PositionSide_LT) {
        const reverseSide = side === "BUY" ? "SELL" : "BUY";

        const openStopLoss = async () => { return await this.isFailedStop(client, symbol, reverseSide, quantity, stopLossPrice, positionSide) };
        const openTakeProfit = async () => { return await this.isFailedStop(client, symbol, reverseSide, quantity, takeProfitPrice, positionSide, false) };

        const cancelStop = async () => {
            return await this.cancelStop(client, symbol)
        }

        const stopResult = await openStopLoss();
        if (stopResult.result) return { status: false };

        const takeResult = await openTakeProfit();
        if (takeResult.result) {
            await cancelStop()
            return { status: false }
        }

        return {
            status: true,
            cancelStop
        }
    };

    public async openPosition(client: Binance, symbol: string, side: OrderSide_LT, futuresMarkPrice: MarkPriceResult[], settings: Settings) {
        const { stopLossPercentage, takeProfitPercentage } = await this.settingsService.getSettings();
        const futuresAccountInfo = await client.futuresAccountInfo()

        const positionSide = side === "BUY" ? "LONG" : "SHORT"
        const markPrice = this.calculateService.getSymbolPriceFromFuturesMarket(futuresMarkPrice, symbol);
        const minNotional = this.constantsService.findMinNotional(symbol);
        const notional = this.calculateService.calculatePositionNotional(minNotional, futuresAccountInfo, settings.notionalPercentage);
        const precision = this.constantsService.findPrecisionForSymbol(symbol);
        const pricePrecision = this.constantsService.findPricePrecision(symbol)
        const [stopLossPrice, takeProfitPrice] = this.calculateService.calculateStopPrices(markPrice, stopLossPercentage, takeProfitPercentage, side, pricePrecision);
        const quantity = this.calculateService.calculateQuantity(markPrice, notional, precision);

        const stopOrders = await this.openStopOrders(client, symbol, side, stopLossPrice, takeProfitPrice, quantity, positionSide);

        if (!stopOrders.status) {
            if (stopOrders.cancelStop) {
                await stopOrders.cancelStop()
            }

            return {
                status: false
            }
        }

        const mainOrderStatus = await this.isFailedMarket(client, symbol, side, quantity, positionSide)

        if (mainOrderStatus.result) {
            await stopOrders.cancelStop();
        }

        return {
            status: !mainOrderStatus.result
        }
    }
}