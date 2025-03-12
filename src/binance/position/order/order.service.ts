import { Injectable } from '@nestjs/common';

import { Binance, FuturesOrder, MarkPriceResult, PositionSide_LT } from 'binance-api-node';

import { OrderSide_LT } from 'binance-api-node';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { ClientsService } from 'src/binance/position/clients/clients.service';
import { CalculateService } from '../calculate/calculate.service';
import { UtilsService } from 'src/utils/utils.service';

@Injectable()
export class OrderService {
    constructor(private constantsService: ConstantsService, private settingsService: SettingsService, private clientsService: ClientsService, private calculateService: CalculateService, private utilsService: UtilsService) {
    }

    public async openFuturesMarketOrder(
        client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        positionSide: PositionSide_LT
    ): Promise<FuturesOrder> {
        return await client.futuresOrder({ symbol, side, quantity, positionSide, type: this.constantsService.MARKET_ORDER_TYPE });
    }

    public async openFuturesStopOrder(
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

    public async isFailedStop<T>(
        client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        stopPrice: string,
        positionSide: PositionSide_LT,
        stopLoss: boolean = true,
    ): Promise<{ data?: T, result: boolean }> {

        return this.utilsService.isFailed(this.openFuturesStopOrder, [client, symbol, side, quantity, stopPrice, positionSide, stopLoss], this)
    }

    public async isFailedMarket<T>(client: Binance,
        symbol: string, side: OrderSide_LT,
        quantity: string,
        positionSide: PositionSide_LT

    ) {
        return this.utilsService.isFailed<T>(this.openFuturesMarketOrder, [client, symbol, side, quantity, positionSide], this)

    }

    public async cancelStop(client: Binance, symbol: string) {
        return await client.cancelOpenOrders({ symbol })
    }

    public async openStopOrders(client: Binance, symbol: string, side: OrderSide_LT, stopLossPrice: string, takeProfitPrice: string, quantity: string, positionSide: PositionSide_LT) {
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
}