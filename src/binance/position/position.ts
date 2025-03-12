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
        return Number(this.futuresAccountInfo.availableBalance)
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
        const isPositionCountMoreOrEqualWithMaxPositionCount = this.positionParameters.maximumPosition <= this.positions.length
        return isPositionCountMoreOrEqualWithMaxPositionCount
    }


    private get openPositionsError(): string[] {
        const errors: string[] = [];

        if (this.isAvailableNotBalanceEnough) {
            errors.push(`Insufficient balance. Available: ${this.availableBalance}, Required: ${this.positionNotional + this.bufferNotional}`);
        }

        if (this.isPositionNotionNotEnoughForBinance) {
            errors.push(`Position notional ${this.positionNotional} < Min required ${this.positionParameters.minNotional}`);
        }

        if (this.isThisSymbolOpened) {
            errors.push(`Position already exists for ${this.positionParameters.symbol}`);
        }

        if (this.isPositionCountMoreOrEqualWithMaxPositionCount) {
            errors.push(`Max positions reached (${this.positionParameters.maximumPosition})`);
        }

        return errors;
    }

    get canPositionOpen() {
        return this.openPositionsError.length === 0;
    }

    private async setFuturesAccountInfo() {
        this.futuresAccountInfo = await this.customerClient.client.futuresAccountInfo()
    }

    public static async create(customerClient: CustomerClient, positionParameters: PositionParameters, constantsService: ConstantsService) {
        const position = new Position(customerClient, positionParameters, constantsService)
        await Promise.all([position.setFuturesAccountInfo(), position.changeLeverage()])
        return position;
    }

    private async openOrders() {
        if (!this.canPositionOpen) {
            return {
                error: { message: this.openPositionsError.pop(), type: "local" }
            }
        }

        const stopOrder = await this.openOrder("STOP_MARKET", false)

        const takeOrder = await this.openOrder("TAKE_PROFIT_MARKET")

        const marketOrder = await this.openOrder("MARKET")


        return [stopOrder, takeOrder, marketOrder].map(order => ({
            type: order.type,
            clientOrderId: order.clientOrderId,
            status: order.status,
            side: order.side,
            positionSide: order.positionSide,
            stopPrice: order.stopPrice,
        }))
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
                    type: "binance"
                }
            }
        }
    }

    private async changeLeverage() {
        return await this.customerClient.client.futuresLeverage({ symbol: this.positionParameters.symbol, leverage: this.positionParameters.leverage })
    }

    private async openOrder(orderType: OrderType_LT, cancelIfFailure: boolean = true) {
        try {
            return await this.order(orderType)
        } catch (err) {
            if (cancelIfFailure) {
                this.cancelOrders()
            }

            throw err;
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


