import { ConstantsService } from "src/constants/constants.service";
import { PositionParameters } from "./position-parameters";
import { FuturesAccountInfoResult, FuturesOrder } from "binance-api-node";
import { CustomerClient } from "../client-manager/customer-client";
import { OrderType_LT } from "binance-api-node";
import { ErrorService } from "src/error/error.service";
import { HttpError } from "binance-api-node";

export class Position {
    futuresAccountInfo: FuturesAccountInfoResult

    constructor(private customerClient: CustomerClient, private positionParameters: PositionParameters, private constantsService: ConstantsService, private errorService: ErrorService) {

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

    private get isBalanceEnough() {
        if (!(this.availableBalance > this.positionNotional + this.bufferNotional)) {
            return false
        }

        if (this.positionParameters.minNotional > this.positionNotional) {
            return false
        }

        return true;
    }

    private async setFuturesAccountInfo() {
        this.futuresAccountInfo = await this.customerClient.client.futuresAccountInfo()
    }

    public static async create(customerClient: CustomerClient, positionParameters: PositionParameters, constantsService: ConstantsService, errorService: ErrorService) {
        const position = new Position(customerClient, positionParameters, constantsService, errorService)
        await Promise.all([position.setFuturesAccountInfo()])
    }

    public async open() {
        if (!this.isBalanceEnough) {
            return {

                status: false,
                reason: "Balance is not enough!"
            }
        }

        const stopOrder = await this.openOrder("STOP_MARKET", false)

        if (!stopOrder.status) {
            return {
                status: false,
                reason: "Market Stop Loss can't open!"
            }
        }
        const takeOrder = await this.openOrder("TAKE_PROFIT_MARKET")

        if (!takeOrder.status) {
            return {
                status: false,
                reason: "Market Take Profit can't open!"
            }
        }

        const marketOrder = await this.openOrder("MARKET")
        if (!marketOrder.status) {
            return {
                status: false,
                reason: "Market Order can't open!"
            }
        }
    }

    private async openOrder(orderType: OrderType_LT, cancelIfFailure: boolean = true) {
        try {
            const order = await this.order(orderType)
            return {
                status: true,
                order
            }
        } catch (err) {
            this.error(err)
            if (cancelIfFailure) {
                this.cancelOrders()
            }

            return {
                status: false,
            }
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
        const cancelOrders = this.customerClient.client.futuresCancelAllOpenOrders({ symbol: this.positionParameters.symbol })

        cancelOrders.catch(this.error)

        await cancelOrders
    }

    private async order(orderType: OrderType_LT) {
        if (orderType === "MARKET") {
            return await this.marketOrder()
        } else if (orderType === "TAKE_PROFIT_MARKET") {
            return await this.marketOrderTakeProfit()
        } else if (orderType === "STOP_MARKET") {
            return await this.marketOrderStopLoss()
        }
    }

    private get error() {
        const errorFunc = async (err: HttpError) => {
            return await this.customerClient.error(err)
        }
        return errorFunc.bind(this)
    }
}


