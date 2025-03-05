import { Injectable } from '@nestjs/common';
import Client, { Binance, FuturesAccountInfoResult, FuturesOrder, MarkPrice, MarkPriceResult } from 'binance-api-node';
import { writeFileSync } from 'fs';

import { OrderSide_LT } from 'binance-api-node';
import { ConstantsService } from 'src/constants/constants.service';
import { SettingsService } from 'src/settings/settings.service';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/binance/clients/clients.service';
import { Settings } from 'src/settings/entity/settings.entity';
const GUARANTEE_BUFFER_FOR_POSITION_OPENING_PERCENTAGE = 0.10
const ORDER_TYPE = "MARKET"


@Injectable()
export class BinanceService {
    constructor(private constantsService: ConstantsService, private settingsService: SettingsService, private usersService: UsersService, private clientsService: ClientsService) {
    }

    async test() {
        function write(data: any, name: string) {
            writeFileSync(`data/${new Date().getTime()}-${name}.json`, JSON.stringify(data, null, 4))
        }

        console.log(this.constantsService.FUTURES_MARKET_INFO.symbols.length)

        // write(await this.client.futuresOrder({
        //     side: "BUY",
        //     quantity: "4.0",
        //     type: "MARKET",
        //     symbol: "XRPUSDT"
        // }), "buy-xrp")


        // // write(
        // //     await this.openFuturesMarketOrder("XRPUSDT", "BUY",
        // //         await this.getFuturesAccountInfo(),
        // //         await this.getFuturesMarkPrice(), POSITION_NOTIONAL_PERCENTAGE),
        // //     "open-futures-market-order")

        // write(await this.getFuturesAccountInfo(), "get-futures-account-info")
    }

    async openFuturesMarketOrder(
        client: Binance,
        symbol: string, side: OrderSide_LT,
        futuresMarkPrice: MarkPriceResult[],
        settings: Settings
    ): Promise<FuturesOrder> {

        const [futuresAccountInfo, changedLeverage] = await Promise.all([this.clientsService.getFuturesAccountInfo(client), this.clientsService.changeFuturesLeverage(client, symbol, settings.leverage)])

        if (changedLeverage.leverage !== settings.leverage) {
            throw Error("Leverage ratio could not be changed!")
        }

        function getSymbolPriceFromFuturesMarket(): number {
            const foundedMarkPrice = futuresMarkPrice.find(markPrice => markPrice.symbol === symbol)

            if (foundedMarkPrice) {
                return Number(foundedMarkPrice.markPrice)
            }

            throw Error("Symbol not found!")
        }

        function calculatePositionNotional(minNotional: number): number {
            const [totalMarginBalance, availableBalance] = [
                futuresAccountInfo.totalMarginBalance,
                futuresAccountInfo.availableBalance
            ].map(balance => Number(balance))

            const positionNotional = totalMarginBalance * settings.notionalPercentage
            const bufferNotional = totalMarginBalance * GUARANTEE_BUFFER_FOR_POSITION_OPENING_PERCENTAGE


            if (!(availableBalance > positionNotional + bufferNotional)) {
                throw Error("Balance is not enough!")
            }

            if (minNotional > positionNotional) {
                throw Error("Balance is not enough!")
            }

            return positionNotional
        }

        function calculateQuantity(markPrice: number, notional: number, precision: number): string {
            const quantity = notional / markPrice
            const fixedQuantity = quantity.toFixed(precision)
            return String(fixedQuantity)
        }

        const markPrice = getSymbolPriceFromFuturesMarket()
        const minNotional = this.constantsService.findMinNotional(symbol)
        const notional = calculatePositionNotional(minNotional)
        const precision = this.constantsService.findPrecisionForSymbol(symbol)
        const quantity = calculateQuantity(markPrice, notional, precision)

        return await client.futuresOrder({ symbol, side, quantity, type: ORDER_TYPE })
    }

    async openFuturesStopLossOrder() {

    }

    async openFuturesTakeProfitOrder() {

    }

    async createPosition(symbol: string, side: OrderSide_LT) {
        const [futuresMarkPrice, settings] = await Promise.all([this.clientsService.runOnSingleClient<Promise<MarkPriceResult[]>>(this.clientsService.getFuturesMarkPrice), this.settingsService.getSettings()])

        this.clientsService.runOnAllClients(((client: Binance) => {
            this.openFuturesMarketOrder(client, symbol, side, futuresMarkPrice, settings)
        }).bind(this))
    }
}
