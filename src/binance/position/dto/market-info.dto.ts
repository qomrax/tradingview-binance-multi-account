import { IsNumber } from "class-validator";


export class MarketInfoDto {
    @IsNumber()
    quantityPrecision: number;
    @IsNumber()
    pricePrecision: number;
    @IsNumber()
    markPrice: number;
    @IsNumber()
    minNotional: number;
}