import { ConstantsService } from "src/constants/constants.service";
import { PositionParameters } from "./position-parameters";
import { FuturesAccountInfoResult, FuturesOrder } from "binance-api-node";
import { CustomerClient } from "../client-manager/customer-client";
import { OrderType_LT } from "binance-api-node";

export class Position {
    futuresAccountInfo: FuturesAccountInfoResult

    constructor(private customerClient: CustomerClient, private positionParameters: PositionParameters, private constantsService: ConstantsService) {
    }

    private get positions() {
        const positions = this.futuresAccountInfo.positions.filter(position => Number(position.positionAmt) !== 0)
        return positions
    }

    private get availableBalance() {
        const availableBalance = Number(this.futuresAccountInfo.availableBalance)

        return availableBalance * (1 - this.constantsService.GUARANTEE_BUFFER_FOR_POSITION_OPENING_PERCENTAGE)
    }

    private get totalMarginBalance() {
        return Number(this.futuresAccountInfo.totalMarginBalance)
    }

    private get positionNotional() {
        return this.totalMarginBalance * this.positionParameters.notionalPercentage;
    }

    private get bufferNotional() {
        return this.totalMarginBalance * this.constantsService.GUARANTEE_BUFFER_FOR_POSITION_OPENING_PERCENTAGE;
    }

    private get quantity(): string {
        const quantity = this.positionNotional / this.positionParameters.markPrice;
        const fixedQuantity = quantity.toFixed(this.positionParameters.quantityPrecision);
        return String(fixedQuantity);
    }

    private get isPositionNotionNotEnoughForBinance() {
        return this.positionParameters.minNotional > this.positionNotional
    }

    private get isAvailableNotBalanceEnough() {
        return this.availableBalance < this.positionNotional + this.bufferNotional
    }

    private get isThisSymbolOpened() {
        const position = this.positions.find((position => position.symbol === this.positionParameters.symbol))
        return !!position
    }

    private get isPositionCountMoreOrEqualWithMaxPositionCount() {
        // const isPositionCountMoreOrEqualWithMaxPositionCount = this.positionParameters.maximumPosition <= this.positions.length
        const isPositionCountMoreOrEqualWithMaxPositionCount = false
        return isPositionCountMoreOrEqualWithMaxPositionCount
    }

    private get openPositionsError(): string {

        if (this.isAvailableNotBalanceEnough) {
            return `Insufficient balance. Available: ${this.availableBalance}, Required: ${this.positionNotional + this.bufferNotional}`;
        }

        if (this.isPositionNotionNotEnoughForBinance) {
            return `Position notional ${this.positionNotional} < Min required ${this.positionParameters.minNotional}`;
        }

        if (this.isThisSymbolOpened) {
            return `Position already exists for ${this.positionParameters.symbol}`;
        }

        if (this.isPositionCountMoreOrEqualWithMaxPositionCount) {
            return `Max positions reached (${this.positionParameters.maximumPosition})`;
        }
    }

    get canPositionOpen() {
        if (this.isAvailableNotBalanceEnough) {
            return false
        }

        if (this.isPositionNotionNotEnoughForBinance) {
            return false
        }

        if (this.isThisSymbolOpened) {
            return false;
        }

        if (this.isPositionCountMoreOrEqualWithMaxPositionCount) {
            return false;
        }

        return true
    }

    private async setFuturesAccountInfo() {
        this.futuresAccountInfo = await this.customerClient.client.futuresAccountInfo()
    }

    public static async create(customerClient: CustomerClient, positionParameters: PositionParameters, constantsService: ConstantsService) {
        const position = new Position(customerClient, positionParameters, constantsService)
        await Promise.all([position.setFuturesAccountInfo(), position.changeLeverage(), position.changeMarginType()])
        return position;
    }

    private async openOrders() {
        if (!this.canPositionOpen) {
            this.customerClient.error({
                code: 1,
                message: this.openPositionsError,
                name: "Local",
                url: "openOrders"
            })
            return {
                error: { message: this.openPositionsError, type: "Local" }
            }
        }

        const marketOrder = await this.openOrder("MARKET", {
            closePosition: false,
            cancelOrders: false
        })
        const stopOrder = await this.openOrder("STOP_MARKET", {
            closePosition: true,
            cancelOrders: false
        })
        const takeOrder = await this.openOrder("TAKE_PROFIT_MARKET", {
            closePosition: true,
            cancelOrders: true
        })


        return [stopOrder, takeOrder, marketOrder].map(order => ({
            type: order.type,
            clientOrderId: order.clientOrderId,
            status: order.status,
            side: order.side,
            positionSide: order.positionSide,
            stopPrice: order.stopPrice,
        }))
    }

    private async openOrder(orderType: OrderType_LT, takeBack: {
        closePosition: boolean,
        cancelOrders: boolean,
    } = {
            closePosition: false,
            cancelOrders: true
        }) {

        const { cancelOrders, closePosition } = takeBack

        try {
            return await this.order(orderType)
        } catch (err) {
            if (cancelOrders) {
                await this.cancelOrders()
            }

            if (closePosition) {
                await this.closePosition()
            }

            throw err;
        }
    }

    public async openPosition() {
        try {
            return await this.openOrders()
        }
        catch (err) {
            return {
                error: {
                    url: err.url,
                    code: err.code,
                    message: err.message,
                    type: "Binance"
                }
            }
        }
    }

    private async changeLeverage() {
        return await this.customerClient.client.futuresLeverage({ symbol: this.positionParameters.symbol, leverage: this.positionParameters.leverage })
    }

    private async changeMarginType() {
        try {
            return await this.customerClient.client.futuresMarginType({ symbol: this.positionParameters.symbol, marginType: this.constantsService.MARGIN_TYPE })
        } catch (error) {
            if (error.code === -4046) {
                return
            }

            throw error
        }
    }

    private async marketOrderStopLoss(): Promise<FuturesOrder> {
        return await this.customerClient.client.futuresOrder({
            ...this.positionParameters.stopLossMarketOrderParams,
            quantity: this.quantity
        })
    }

    private async marketOrderTakeProfit(): Promise<FuturesOrder> {
        return await this.customerClient.client.futuresOrder({
            ...this.positionParameters.takeProfitMarketOrderParams,
            quantity: this.quantity
        })
    }

    private async marketOrder(): Promise<FuturesOrder> {
        return await this.customerClient.client.futuresOrder({
            ...this.positionParameters.marketOrderParams,
            quantity: this.quantity
        })
    }

    private async cancelOrders() {
        await this.customerClient.client.futuresCancelAllOpenOrders({ symbol: this.positionParameters.symbol })
    }

    private async closePosition(): Promise<FuturesOrder> {
        return await this.customerClient.client.futuresOrder({
            ...this.positionParameters.closePositionParams,
            quantity: this.quantity
        })
    }

    private async order(orderType: OrderType_LT): Promise<FuturesOrder> {
        if (orderType === "MARKET") {
            return await this.marketOrder()
        } else if (orderType === "TAKE_PROFIT_MARKET") {
            return await this.marketOrderTakeProfit()
        } else if (orderType === "STOP_MARKET") {
            return await this.marketOrderStopLoss()
        }

        throw Error("Order type not matching!")
    }
}


