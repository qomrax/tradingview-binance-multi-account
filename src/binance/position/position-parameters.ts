import { ConstantsService } from "src/constants/constants.service";
import { OrderSide_LT, PositionSide_LT, StopMarketNewFuturesOrder, MarketNewFuturesOrder, TakeProfitMarketNewFuturesOrder } from "binance-api-node";
import { SettingsService } from "src/settings/settings.service";
import { Settings } from "src/settings/settings.entity";

export class PositionParameters {
    settings: Settings

    constructor(
        public symbol: string, public side: OrderSide_LT,
        public markPrice: number,
        public constantsService: ConstantsService,
        public settingsService: SettingsService,
    ) {

    }

    private get pricePrecision() {
        return this.constantsService.findPricePrecision(this.symbol)
    }

    public get quantityPrecision() {
        return this.constantsService.findPrecisionForSymbol(this.symbol)
    }

    private get takeProfitPrice(): string {
        const adjustedTakeProfitPercentage = this.settings.takeProfitPercentage / this.leverage;
        const takeProfitPriceDiff = this.markPrice * adjustedTakeProfitPercentage;

        let stop: number;

        if (this.side === "BUY") {
            stop = this.markPrice + takeProfitPriceDiff;
        } else {
            stop = this.markPrice - takeProfitPriceDiff;
        }

        return String(stop.toFixed(this.pricePrecision))
    }

    private get stopLossPrice(): string {
        const adjustedStopLossPercentage = this.settings.stopLossPercentage / this.leverage;
        const stopLossPriceDiff = this.markPrice * adjustedStopLossPercentage;

        let stop: number;

        if (this.side === "BUY") {
            stop = this.markPrice - stopLossPriceDiff;
        } else {
            stop = this.markPrice + stopLossPriceDiff;
        }

        return String(stop.toFixed(this.pricePrecision))
    }

    private get positionSide(): PositionSide_LT {
        const positionSide = this.side === "BUY" ? "LONG" : "SHORT"
        return positionSide
    }

    private get closeSide(): OrderSide_LT {
        const closePositionSide = this.side === "BUY" ? "SELL" : "BUY"
        return closePositionSide
    }


    public get takeProfitMarketOrderParams(): TakeProfitMarketNewFuturesOrder {
        const timeInForce: "GTE_GTC" = "GTE_GTC"
        return {
            ...this.defaultParams,
            stopPrice: this.takeProfitPrice,
            type: this.constantsService.MARKET_TAKE_PROFIT_TYPE,
            side: this.closeSide,
            closePosition: "true",
            timeInForce
        }
    }

    public get stopLossMarketOrderParams(): StopMarketNewFuturesOrder {
        const timeInForce: "GTE_GTC" = "GTE_GTC"
        return {
            ...this.defaultParams,
            stopPrice: this.stopLossPrice,
            type: this.constantsService.MARKET_STOP_TYPE,
            side: this.closeSide,
            closePosition: "true",
            timeInForce
        }
    }


    public get marketOrderParams() {
        return {
            ...this.defaultParams,
            type: this.constantsService.MARKET_ORDER_TYPE
        }
    }

    public get closePositionParams() {
        return {
            ...this.marketOrderParams,
            side: this.closeSide,
        }
    }

    private get defaultParams() {
        return {
            symbol: this.symbol,
            positionSide: this.positionSide,
            side: this.side,
        }
    }

    public get notionalPercentage() {
        return this.settings.notionalPercentage
    }

    public get leverage() {
        return this.settings.leverage;
    }

    public get maximumPosition() {
        return this.settings.maximumPosition
    }

    public get minNotional() {
        return this.constantsService.findMinNotional(this.symbol)
    }

    private async setSettings() {
        this.settings = await this.settingsService.getSettings()
    }

    public async prepareRemoteDatas(): Promise<boolean> {
        try {
            await this.setSettings()
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    public static async create(
        symbol: string, side: OrderSide_LT,
        markPrice: number,
        constantsService: ConstantsService,
        settingsService: SettingsService
    ) {
        const positionParameters = new PositionParameters(symbol, side, markPrice, constantsService, settingsService)
        const isPositionParametersPrepared = await positionParameters.prepareRemoteDatas()
        if (!isPositionParametersPrepared) {
            throw Error("Position parameters can't prepared!")
        }

        return positionParameters
    }
}
