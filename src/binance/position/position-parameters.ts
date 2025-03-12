import { ConstantsService } from "src/constants/constants.service";
import { OrderSide_LT, PositionSide_LT } from "binance-api-node";
import { ClientManagerService } from "../client-manager/client-manager.service";
import { SettingsService } from "src/settings/settings.service";
import { Settings } from "src/settings/entity/settings.entity";

export class PositionParameters {
    markPrice: number;
    settings: Settings

    constructor(
        public symbol: string, public side: OrderSide_LT,
        public constantsService: ConstantsService,
        public clientManagerService: ClientManagerService,
        public settingsService: SettingsService
    ) {

    }

    private get pricePrecision() {
        return this.constantsService.findPricePrecision(this.symbol)
    }

    public get quantityPrecision() {
        return this.constantsService.findPrecisionForSymbol(this.symbol)
    }

    private get takeProfitPrice(): string {
        const adjustedTakeProfitPercentage = this.settings.takeProfitPercentage / this.settings.leverage;
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
        const adjustedStopLossPercentage = this.settings.stopLossPercentage / this.settings.leverage;
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
        return this.side === "BUY" ? "LONG" : "SHORT"
    }

    public get takeProfitMarketOrderParams() {
        return {
            ...this.defaultParams,
            stopPrice: this.takeProfitPrice,
            type: this.constantsService.MARKET_TAKE_PROFIT_TYPE
        }
    }

    public get stopLossMarketOrderParams() {
        return {
            ...this.defaultParams,
            stopPrice: this.stopLossPrice,
            type: this.constantsService.MARKET_STOP_TYPE
        }
    }

    public get marketOrderParams() {

        return {
            ...this.defaultParams,
            type: this.constantsService.MARKET_ORDER_TYPE
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

    public get minNotional() {
        return this.constantsService.findMinNotional(this.symbol)
    }

    private async setMarketPrice() {
        this.markPrice = await this.clientManagerService.getFuturesMarkPrice(this.symbol)
    }

    private async setSettings() {
        this.settings = await this.settingsService.getSettings()
    }

    public async prepareRemoteDatas(): Promise<boolean> {
        try {
            await Promise.all([this.setMarketPrice(), this.setSettings()])
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    public static async createPositionParameters(
        symbol: string, side: OrderSide_LT,
        constantsService: ConstantsService,
        clientManagerService: ClientManagerService,
        settingsService: SettingsService
    ) {
        const positionParameters = new PositionParameters(symbol, side, constantsService, clientManagerService, settingsService)
        const isPositionParametersPrepared = await positionParameters.prepareRemoteDatas()
        if (!isPositionParametersPrepared) {
            return positionParameters
        } else {
            throw Error("Position parameters can't prepared!")
        }
    }
}
