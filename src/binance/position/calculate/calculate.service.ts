import { Injectable } from '@nestjs/common';
import { OrderSide_LT, FuturesAccountInfoResult, MarkPriceResult } from 'binance-api-node';
import { ConstantsService } from 'src/constants/constants.service';
@Injectable()
export class CalculateService {
    constructor(private constantsService: ConstantsService) {

    }

    public calculateQuantity(markPrice: number, notional: number, precision: number) {
        const quantity = notional / markPrice;
        const fixedQuantity = quantity.toFixed(precision);
        return String(fixedQuantity);
    }

    public calculateStopPrices(markPrice: number, stopLossPercentage: number, takeProfitPercentage: number, side: OrderSide_LT, precision: number, leverage: number) {
        // Adjust percentages by dividing by leverage
        const adjustedStopLossPercentage = stopLossPercentage / leverage;
        const adjustedTakeProfitPercentage = takeProfitPercentage / leverage;

        const stopLossPriceDiff = markPrice * adjustedStopLossPercentage;
        const takeProfitPriceDiff = markPrice * adjustedTakeProfitPercentage;

        let stopLossPrice: number, takeProfitPrice: number;

        if (side === "BUY") {
            stopLossPrice = markPrice - stopLossPriceDiff;
            takeProfitPrice = markPrice + takeProfitPriceDiff;
        }
        else {
            stopLossPrice = markPrice + stopLossPriceDiff;
            takeProfitPrice = markPrice - takeProfitPriceDiff;
        }

        return [stopLossPrice, takeProfitPrice].map(stop => String(stop.toFixed(precision)));
    }


    public getSymbolPriceFromFuturesMarket(futuresMarkPrice: MarkPriceResult[], symbol: string) {
        const foundedMarkPrice = futuresMarkPrice.find(markPrice => markPrice.symbol === symbol);
        if (foundedMarkPrice) {
            return Number(foundedMarkPrice.markPrice);
        }
        throw Error("Symbol not found!");
    }

    public calculatePositionNotional(minNotional: number, futuresAccountInfo: FuturesAccountInfoResult, notionalPercentage: number) {
        const [totalMarginBalance, availableBalance] = [
            Number(futuresAccountInfo.totalMarginBalance),
            Number(futuresAccountInfo.availableBalance)
        ];

        const positionNotional = totalMarginBalance * notionalPercentage;
        const bufferNotional = totalMarginBalance * this.constantsService.GUARANTEE_BUFFER_FOR_POSITION_OPENING_PERCENTAGE;

        if (!(availableBalance > positionNotional + bufferNotional)) {
            throw Error("Balance is not enough!");
        }

        if (minNotional > positionNotional) {
            throw Error("Balance is not enough!");
        }

        return positionNotional;
    }
}
